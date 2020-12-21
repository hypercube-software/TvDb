package com.hypercube.tvdb.api.model;

public class Response {
	private ResponseStatus status = ResponseStatus.OK;
	private String message;

	public ResponseStatus getStatus() {
		return status;
	}

	public void setStatus(ResponseStatus status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
