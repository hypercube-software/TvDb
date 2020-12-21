export enum ResponseStatus {
    OK = "OK",
	ERROR = "ERROR"
}

export interface Response {
    status: ResponseStatus;
    message?: string;
}