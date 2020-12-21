package com.hypercube.tvdb.api.model;

import java.util.List;

public class SearchResult extends Response {
	private List<TvShow> result;

	public List<TvShow> getResult() {
		return result;
	}

	public void setResult(List<TvShow> result) {
		this.result = result;
	}
}
