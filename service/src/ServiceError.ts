class ServiceError extends Error {
    status: string;

    constructor(status: string, message?: string) {
        super(message);
        this.status = status;
    }
}

