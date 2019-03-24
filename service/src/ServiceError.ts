export class ServiceError extends Error {
    status: string;
    payload: any;

    constructor(status: string, message?: string, payload?: any) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}

