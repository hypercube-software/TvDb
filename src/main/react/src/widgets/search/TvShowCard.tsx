import React, { ReactNode ,ChangeEvent, FocusEvent } from 'react';
import { Box, Card,  CardActions, CardContent } from '@material-ui/core';
import { TextField, IconButton, Button, Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import BaseComponent from '../common/BaseComponent';
import TvShow from '../../model/TvShow';
import { ConfirmDialog, DialogType, DialogButton } from '../dialogs/ConfirmDialog';
import ReactHtmlParser from 'react-html-parser';
import TvShowSerrvice from '../../services/TvDbService';
import css from './TvShowCard.less';

interface ITvShowCardState {
    showConfirmDelete: boolean;
    showUpdateError: boolean;
    editMode: boolean;
    editedTvShow: TvShow;
    lastErrorMessage: string;
}
interface ITvShowCardProps {
    data: TvShow,
    onAdd: (tvShow: TvShow) => void;
    onDelete: (tvShowId: number) => void;
    onUpdate: (tvShow: TvShow) => void;
}

export default class TvShowCard extends BaseComponent<ITvShowCardProps, ITvShowCardState> {
    state: ITvShowCardState = {
        showConfirmDelete: false,
        showUpdateError: false,
        editMode: false,
        editedTvShow: null,
        lastErrorMessage: null
    }

    constructor(props: ITvShowCardProps) {
        super(props)
    }
    onLearnMore():void {
        const win = window.open(this.props.data.url, '_blank');
        win.focus();
    }

    onDeleteResponse(confirm: DialogButton):void {
        this.setState({
            showConfirmDelete: false
        })
        if (confirm === DialogButton.YES && this.props.onDelete) {

            this.props.onDelete(this.props.data.id);
        }
    }
    onAdd():void {
        if (this.props.onAdd) {
            this.props.onAdd(this.props.data);
        }
    }

    onDelete():void {
        this.setState({
            showConfirmDelete: true
        })
    }
    onEdit():void {
        this.setState({
            editMode: true,
            editedTvShow: Object.assign({}, this.props.data)
        });
    }

    onSummaryChange(event: ChangeEvent<HTMLInputElement>):void {
        this.state.editedTvShow.summary = event.target.value;
        this.setState({
            editedTvShow: this.state.editedTvShow
        })
    }
    onSummaryBlur(event: FocusEvent<HTMLInputElement>):void {
        TvShowSerrvice.update(this.state.editedTvShow).then(r => {
            if (r.status === 'OK') {
                this.setState({
                    editMode: false
                })
                if (this.props.onUpdate) {
                    this.props.onUpdate(this.state.editedTvShow);
                }
            }
            else {
                this.setState({
                    editMode: true,
                    showUpdateError: true,
                    lastErrorMessage: r.message
                })
            }
        })
    }
    onErrorDialogClosed():void {
        this.setState({
            showUpdateError: false,
            lastErrorMessage: null
        })
    }
    render():ReactNode  {
        const deleteButton = <Tooltip title="Remove this item from your database..."><IconButton aria-label="delete" onClick={this.onDelete}>
            <DeleteIcon />
        </IconButton>
        </Tooltip>;
        const editButton = <Tooltip title="Edit this item..."><IconButton aria-label="edit" onClick={this.onEdit}>
            <EditIcon />
        </IconButton>
        </Tooltip>;
        const addButton = <Tooltip title="Add this item to your database...">
            <IconButton aria-label="add" onClick={this.onAdd}>
                <AddIcon />
            </IconButton>
        </Tooltip>;
        return (
            <Card className={css.root}>
                {this.state.showConfirmDelete ? <ConfirmDialog
                    title="Item deletion"
                    type={DialogType.YESNO}
                    content="Remove this item ?"
                    onResponse={this.onDeleteResponse} /> : null}
                {this.state.showUpdateError ? <ConfirmDialog
                    title="Item update error"
                    type={DialogType.ERROR}
                    content={this.state.lastErrorMessage}
                    onResponse={this.onErrorDialogClosed} /> : null}
                <div className={css.content}>
                    <img className={css.media} src={this.props.data.thumbnail} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.data.name}
                        </Typography>
                    </CardContent>
                </div>
                {this.state.editMode ?
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        value={this.state.editedTvShow.summary}
                        onChange={this.onSummaryChange}
                        onBlur={this.onSummaryBlur}
                        variant="outlined"
                    />
                    :
                    <Typography variant="body2" color="textSecondary" component="div">
                        {ReactHtmlParser(this.props.data.summary)}
                    </Typography>}
                <div className={css.grow} />
                <CardActions className={css.actions}>
                    {this.props.data.id ? editButton : addButton}
                    {this.props.data.id ? deleteButton : null}
                    <Box flexGrow={1} />
                    <Button size="small" color="primary" onClick={this.onLearnMore}>
                        Learn More
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
