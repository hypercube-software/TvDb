package com.hypercube.tvdb.api.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class TvShow {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Long id;
	private String name;
	private String thumbnail;
	private String artwork;
	private String url;
	private String summary;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getArtwork() {
		return artwork;
	}

	public void setArtwork(String artwork) {
		this.artwork = artwork;
	}

}
