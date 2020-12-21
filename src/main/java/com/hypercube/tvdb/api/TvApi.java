package com.hypercube.tvdb.api;

import javax.persistence.EntityNotFoundException;

import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.hypercube.tvdb.api.model.Response;
import com.hypercube.tvdb.api.model.ResponseStatus;
import com.hypercube.tvdb.api.model.SearchResult;
import com.hypercube.tvdb.api.model.TvShow;
import com.hypercube.tvdb.repository.TvDbRepository;
import com.hypercube.tvdb.services.tvmaze.TvMaze;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "api/tv")
@Tag(name = "TvDb", description = "the TvDB API")
public class TvApi {
	Logger logger = LoggerFactory.getLogger(TvApi.class);

	@Autowired
	private TvMaze tvMaze;

	@Autowired
	private TvDbRepository tvdb;

    @Operation(summary = "Search a TvShow", description = "The search occur in the H2 database or externally in TvMaze", tags = { "CRUD" })    
	@RequestMapping(value = "search", params = { "q", "ext" }, method = RequestMethod.GET)
	public @ResponseBody SearchResult search(@RequestParam("q") String searchString,
			@RequestParam("ext") boolean externalSearch) {
		if (externalSearch) {
			return tvMaze.search(searchString);
		} else {
			// Example of Query by Example (QBE) API

			// We first specify on WHAT we are looking for
			//
			TvShow tvShow = new TvShow();
			tvShow.setName(searchString);
			tvShow.setSummary(searchString);

			// then we specify the HOW
			// contains + ignore case
			//
			ExampleMatcher matcher = ExampleMatcher.matchingAny()
					.withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains()
							.ignoreCase())
					.withMatcher("summary", ExampleMatcher.GenericPropertyMatchers.contains()
							.ignoreCase());

			// Spring Data will forge the SQL for us using our example
			Example<TvShow> example = Example.of(tvShow, matcher);
			SearchResult r = new SearchResult();
			r.setResult(tvdb.findAll(example));
			return r;
		}
	}

    @Operation(summary = "Create a TvShow", description = "Save a TvShow in H2 database", tags = { "CRUD" })    
	@RequestMapping(value = "create", method = RequestMethod.POST)
	public @ResponseBody Response create(@RequestBody TvShow tvShow) {
		Response r = new Response();
		try {
			TvShow saved = tvdb.save(tvShow);
			logger.info("New TvShow added: id=" + saved.getId());
		} catch (Exception e) {
			r.setStatus(ResponseStatus.ERROR);
			if (e.getCause() instanceof ConstraintViolationException) {
				r.setMessage("Item already created");
			} else {
				r.setMessage(e.getMessage());
			}
		}
		return r;
	}

    @Operation(summary = "Update a TvShow", description = "Update a TvShow in H2 database", tags = { "CRUD" })    
	@RequestMapping(value = "update", method = RequestMethod.PUT)
	public @ResponseBody Response add(@RequestBody TvShow tvShow) {
		Response r = new Response();
		try {
			if (tvShow.getId() == null)
				throw new EntityNotFoundException("Item " + tvShow.getId() + " does not exists");
			else
				tvdb.getOne(tvShow.getId());

			TvShow saved = tvdb.save(tvShow);
			logger.info("TvShow " + saved.getId() + " Updated");
		} catch (Exception e) {
			r.setStatus(ResponseStatus.ERROR);
			r.setMessage(e.getMessage());
		}
		return r;
	}

    @Operation(summary = "Delete a TvShow", description = "Delete a TvShow in H2 database", tags = { "CRUD" })    
	@RequestMapping(value = "delete", params = { "id" }, method = RequestMethod.DELETE)
	public @ResponseBody Response delete(@RequestParam("id") Long tvShowId) {
		Response r = new Response();
		try {
			tvdb.deleteById(tvShowId);
			logger.info("TvShow " + tvShowId + " deleted");
		} catch (Exception e) {
			if (e instanceof EmptyResultDataAccessException) {
				r.setStatus(ResponseStatus.ERROR);
				r.setMessage("Item already deleted");
			} else {
				r.setStatus(ResponseStatus.ERROR);
				r.setMessage(e.getMessage());
			}
		}
		return r;
	}
}
