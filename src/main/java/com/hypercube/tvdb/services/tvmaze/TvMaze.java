package com.hypercube.tvdb.services.tvmaze;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.hypercube.tvdb.api.model.ResponseStatus;
import com.hypercube.tvdb.api.model.SearchResult;
import com.hypercube.tvdb.services.tvmaze.model.TvShow;
import com.hypercube.tvdb.services.tvmaze.model.TvShowResult;

@Service
public class TvMaze {
	Logger logger = LoggerFactory.getLogger(TvMaze.class);

	public SearchResult search(String query) {
		SearchResult response = new SearchResult();
		try {
			RestTemplate restTemplate = new RestTemplate();
			TvShowResult[] result = restTemplate.getForObject("http://api.tvmaze.com/search/shows?q={name}",
					TvShowResult[].class, query);
			response.setResult(Arrays.asList(result)
					.stream()
					.map(r -> r.getShow())
					.map(this::buildResult)
					.collect(Collectors.toList()));

		} catch (RestClientException e) {
			logger.error("Unexpected error", e);
			response.setMessage(e.getMessage());
			response.setStatus(ResponseStatus.ERROR);
		}
		return response;
	}

	private com.hypercube.tvdb.api.model.TvShow buildResult(TvShow mazeShow) {
		com.hypercube.tvdb.api.model.TvShow show = new com.hypercube.tvdb.api.model.TvShow();
		show.setName(mazeShow.getName());
		show.setSummary(mazeShow.getSummary());
		show.setUrl(mazeShow.getUrl());
		if (mazeShow.getImage()!=null)
		{
			show.setThumbnail(mazeShow.getImage().getMedium());
			show.setArtwork(mazeShow.getImage().getOriginal());
		}
		return show;
	}
}
