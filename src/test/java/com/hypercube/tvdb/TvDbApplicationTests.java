package com.hypercube.tvdb;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.JdbcTemplate;

import com.hypercube.tvdb.api.model.Response;
import com.hypercube.tvdb.api.model.ResponseStatus;
import com.hypercube.tvdb.api.model.SearchResult;
import com.hypercube.tvdb.api.model.TvShow;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class TvDbApplicationTests {
	private static final String HTTP_LOCALHOST = "http://localhost:";

	Logger logger = LoggerFactory.getLogger(TvDbApplicationTests.class);
	
	@LocalServerPort
	private int port;

	@Autowired
	private TestRestTemplate restTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@BeforeEach
	public void setUpDatabase() {
		logger.info("Clear Database before testing...");
		jdbcTemplate.execute("TRUNCATE TABLE TV_SHOW");
	}

	private String encodeValue(String value) throws UnsupportedEncodingException {
		return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
	}

	private static final String TEST_TV_SHOW = "The A-Team";

	private SearchResult searchTvShows(String query, boolean externalSearch) throws UnsupportedEncodingException {
		String encodedQuery = encodeValue(query);
		return restTemplate.getForObject(
				HTTP_LOCALHOST + port + "/api/tv/search?q=" + encodedQuery + "&ext=" + externalSearch,
				SearchResult.class);
	}

	private Optional<TvShow> searchTvShow(String tvShowName, boolean externalSearch)
			throws UnsupportedEncodingException {
		SearchResult result = searchTvShows(tvShowName, externalSearch);
		assertThat(result.getStatus()).isEqualTo(ResponseStatus.OK);
		return result.getResult()
				.stream()
				.filter(t -> t.getName()
						.equalsIgnoreCase(tvShowName))
				.findFirst();
	}

	private Response searchAndCreateTvShow() throws UnsupportedEncodingException {
		Optional<TvShow> tvShowToCreate = searchTvShow(TEST_TV_SHOW, true);
		assertThat(tvShowToCreate).isPresent();
		return createTvShow(tvShowToCreate.get());
	}

	private Response createTvShow(TvShow tvShowToCreate) {
		return restTemplate.postForObject(HTTP_LOCALHOST + port + "/api/tv/create", tvShowToCreate,
				Response.class);
	}
	private Response deleteTvShow(Long id) {
		return restTemplate.exchange(
				HTTP_LOCALHOST + port + "/api/tv/delete?id=" + id,
				HttpMethod.DELETE,
				null,
				Response.class).getBody();
	}

	@Test
	public void externalSearchWorks() throws UnsupportedEncodingException {
		Optional<TvShow> result = searchTvShow(TEST_TV_SHOW, true);

		assertThat(result).isPresent();
	}

	@Test
	public void tvShowCreationWorks() throws UnsupportedEncodingException {
		Response response = searchAndCreateTvShow();

		assertThat(response.getStatus() == ResponseStatus.OK).isTrue();
	}
	
	@Test
	public void tvShowDoubleCreationFails() throws UnsupportedEncodingException {
		Response response = searchAndCreateTvShow();

		assertThat(response.getStatus() == ResponseStatus.OK).isTrue();

		response = searchAndCreateTvShow();

		assertThat(response.getStatus() == ResponseStatus.ERROR).isTrue();

	}

	@Test
	public void tvShowDeletionWorks() throws UnsupportedEncodingException {
		Response response = searchAndCreateTvShow();
		assertThat(response.getStatus() == ResponseStatus.OK).isTrue();
		
		Optional<TvShow> tvShow = searchTvShow(TEST_TV_SHOW, false);
		assertThat(tvShow).isPresent();
		assertThat(tvShow.get()
				.getName()).isEqualTo(TEST_TV_SHOW);
		
		response = deleteTvShow(tvShow.get().getId());
		assertThat(response.getStatus() == ResponseStatus.OK).isTrue();
		
		tvShow = searchTvShow(TEST_TV_SHOW, false);
		assertThat(tvShow).isEmpty();
	}
	
	@Test
	public void tvShowDoubleDeletionFail() throws UnsupportedEncodingException {
		Response response = searchAndCreateTvShow();
		assertThat(response.getStatus() == ResponseStatus.OK).isTrue();
		
		Optional<TvShow> tvShow = searchTvShow(TEST_TV_SHOW, false);
		assertThat(tvShow).isPresent();
		assertThat(tvShow.get()
				.getName()).isEqualTo(TEST_TV_SHOW);
		
		response = deleteTvShow(tvShow.get().getId());
		assertThat(response.getStatus() == ResponseStatus.OK).isTrue();
		
		response = deleteTvShow(tvShow.get().getId());
		assertThat(response.getStatus() == ResponseStatus.ERROR).isTrue();

		tvShow = searchTvShow(TEST_TV_SHOW, false);
		assertThat(tvShow).isEmpty();

}

	
	@Test
	public void localSearchWorksInUpperAndLowerCase() throws UnsupportedEncodingException {
		Response response = searchAndCreateTvShow();
		assertThat(response.getStatus()).isEqualTo(ResponseStatus.OK);

		Optional<TvShow> tvShow = searchTvShow(TEST_TV_SHOW, false);
		assertThat(tvShow).isPresent();
		assertThat(tvShow.get()
				.getName()).isEqualTo(TEST_TV_SHOW);

		tvShow = searchTvShow(TEST_TV_SHOW.toLowerCase(), false);
		assertThat(tvShow).isPresent();
		assertThat(tvShow.get()
				.getName()).isEqualTo(TEST_TV_SHOW);
	
	}

}
