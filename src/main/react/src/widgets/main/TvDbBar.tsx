import React, { ChangeEvent, KeyboardEvent, ReactNode  } from 'react';
import { AppBar, Toolbar, InputBase, Switch } from '@material-ui/core';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import BaseComponent from '../common/BaseComponent';
import { ApplicationStore, StoreUpdate, Subscription, EXERNAL_SEARCH_KEY } from '../../stores/ApplicationStore';
import css from './TvDbBar.less';

interface ITvDbBarState {
    searchQuery: string
    externalSearch: boolean
}
interface ITvDbBarProps {
    onSearch?: (query: string, externalSearch: boolean) => void;
}

export default class TvDbBar extends BaseComponent<ITvDbBarProps, ITvDbBarState> {
    state: ITvDbBarState = {
        searchQuery: "",
        externalSearch: false
    }

    appStoreSubscription: Subscription

    constructor(props: ITvDbBarProps) {
        super(props)
    }
    componentDidMount():void {
        this.appStoreSubscription = ApplicationStore.subscribe(EXERNAL_SEARCH_KEY, this.onExternalSearchChanged);
    }
    componentWillUnmount():void {
        this.appStoreSubscription.unsubscribe();
    }
    onExternalSearchChanged(update:StoreUpdate):void{
        this.setState({
            externalSearch: ApplicationStore.externalSearch
        })
    }
    onExternalSearchChange(event: ChangeEvent<HTMLInputElement>):void {
        ApplicationStore.send(EXERNAL_SEARCH_KEY, event.target.checked);      
    }
    onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>):void {
        this.setState({
            searchQuery: event.currentTarget.value
        });
    }
    onKeyDown(event: KeyboardEvent<HTMLInputElement>):void {
        if (event.key==="Enter" || event.key === "NumpadEnter") {
            this.onSearch();
        }
    }
    onSearch():void {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.searchQuery, this.state.externalSearch);
        }
    }
    render():ReactNode  {
        return (
            <AppBar position="fixed" >
                <Toolbar>
                    <Typography className={css.title} variant="h6" noWrap>Welcome to TvDb</Typography>
                    <div className={css.grow} />
                    <FormGroup row>
                        <div className={css.search}>
                            <InputBase className={css.searchInput}
                                placeholder="Search…"
                                onKeyDown={this.onKeyDown}
                                onChange={this.onChangeSearchQuery}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                        <IconButton aria-label="search" onClick={this.onSearch} >
                            <SearchIcon className={css.searchIcon} />
                        </IconButton>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.externalSearch}
                                    onChange={this.onExternalSearchChange}
                                    color="secondary"
                                    name="externalSearchCB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label="Web Search"
                        />
                    </FormGroup>

                </Toolbar>
            </AppBar>
        );
    }
}
