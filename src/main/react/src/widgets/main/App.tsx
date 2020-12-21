import React, { ReactNode } from 'react';
import BaseComponent from '../common/BaseComponent';
import WelcomeDialog from '../dialogs/WelcomeDialog';
import TvDbBar from './TvDbBar';
import { ConfirmDialog, DialogType } from '../../widgets/dialogs/ConfirmDialog';
import SearchResult from '../../model/SearchResult';
import TvDbService from '../../services/TvDbService';
import TvShowCard from '../search/TvShowCard';
import TvShow from '../../model/TvShow';
import { Response, ResponseStatus } from '../../model/Response';
import { ApplicationStore, StoreUpdate, Subscription, EXERNAL_SEARCH_KEY } from '../../stores/ApplicationStore';
import css from './App.less';

interface IAppProps {

}
interface IAppState {
  showWelcome: boolean
  showError: boolean
  searchResult: SearchResult
  lastQuery: string
  lastError: string
}

export default class App extends BaseComponent<IAppProps, IAppState> {
  appStoreSubscription: Subscription;

  state: IAppState = {
    showError: false,
    showWelcome: true,
    searchResult: null,
    lastQuery: null,
    lastError: null
  }

  constructor(props: IAppProps) {
    super(props);
  }



  onExternalSearchChange(update: StoreUpdate):void {
    console.log("Store changed:" + update.path + " " + update.value);
  }
  onCollectionUpdate(response: Response):void {
    if (response.status === ResponseStatus.OK) {
      ApplicationStore.send(EXERNAL_SEARCH_KEY, false);
      this.refreshSearch();
    } else {
      this.setState({
        showError: true,
        lastError: response.message
      })
    }
  }
  onAdd(tvShow: TvShow):void {
    TvDbService.create(tvShow).then(this.onCollectionUpdate);
  }

  onDelete(tvShowId: number):void {
    TvDbService.delete(tvShowId).then(this.onCollectionUpdate);
  }
  onUpdate(updatedTvShow: TvShow):void {
    const idx = this.state.searchResult.result.findIndex(tvs => tvs.id === updatedTvShow.id);
    if (idx) {
      this.state.searchResult.result[idx] = updatedTvShow;
      this.setState({
        searchResult: this.state.searchResult,
      });
    }
  }

  onGetIn():void {
    this.setState({
      showWelcome: false
    })
  }

  onSearch(query: string):void {
    TvDbService.search(query, ApplicationStore.externalSearch)
      .then(result => {
        this.setState({
          searchResult: result,
          lastQuery: query
        });
      })
  }
  refreshSearch():void {
    this.onSearch(this.state.lastQuery);
  }
  onCloseDialogError():void {
    this.setState({
      showError: false
    });
  }
  render():ReactNode {
    let result:ReactNode = <div />

    if (this.state.searchResult && this.state.searchResult.result) {
      result = this.state.searchResult.result.map((tvshow, idx) => <TvShowCard
        key={"show" + idx}
        data={tvshow}
        onAdd={this.onAdd}
        onDelete={this.onDelete}
        onUpdate={this.onUpdate}
      />)
    }
    const main = <React.Fragment>
      {this.state.showError ? <ConfirmDialog
        title="Error"
        type={DialogType.ERROR}
        content={this.state.lastError}
        onResponse={this.onCloseDialogError} /> : null}
      <TvDbBar onSearch={this.onSearch} />
      <div className={css.searchResult}>
        {result}
      </div>
    </React.Fragment>

    const content = this.state.showWelcome ? <WelcomeDialog onGetIn={this.onGetIn} /> : main;
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}
