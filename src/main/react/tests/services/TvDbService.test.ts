import TvDbService from '../../src/services/TvDbService';
const nodeFetch = require("node-fetch");
function myFetch(url: string): Promise<Response> {
    return nodeFetch("http://localhost:8080" + url);
}
global.fetch = myFetch;

describe('TvDbService tests', () => {

    it("can do an external search", () => {
        return expect(TvDbService.search("The A-Team", true).then(sr => sr.result.filter(tvShow => {
            return tvShow.name === "The A-Team";
        }))).resolves.toMatchSnapshot();
    })

});