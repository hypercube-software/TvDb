import TvShow from './TvShow';
import {Response} from './Response';

export default interface SearchResult extends Response {
    result: TvShow[];
}