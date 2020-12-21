import {Response} from "../model/Response";
import SearchResult from "../model/SearchResult";
import TvShow from "../model/TvShow";

class TvDbService {
    delete(tvShowId: number):Promise<Response> {
        const payload = {
            method: 'DELETE'
        }
        return fetch('/api/tv/delete?id=' + tvShowId, payload)
            .then(r => r.json());
    }

    create(tvShow: TvShow):Promise<Response> {
        const payload = {
            method: 'POST',
            body: JSON.stringify(tvShow),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        return fetch('/api/tv/create', payload)
            .then(r => r.json());
    }

    update(tvShow: TvShow):Promise<Response> {
        const payload = {
            method: 'PUT',
            body: JSON.stringify(tvShow),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        return fetch('/api/tv/update', payload)
            .then(r => r.json());
    }

    search(query: string, externalSearch: boolean):Promise<SearchResult> {        
        return fetch('/api/tv/search?q=' + query + "&ext=" + externalSearch)
            .then(r => r.json());
    }
}

export default new TvDbService();