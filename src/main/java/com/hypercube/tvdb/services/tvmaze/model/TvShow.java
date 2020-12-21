package com.hypercube.tvdb.services.tvmaze.model;

public class TvShow {
	private int id;
	private String name;
	private String url;
	private TvShowImage image;
	private String summary;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public TvShowImage getImage() {
		return image;
	}
	public void setImage(TvShowImage image) {
		this.image = image;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
    
    
}
