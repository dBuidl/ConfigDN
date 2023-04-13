export interface DatabaseInsertDataError {
    [key: string]: {
        message: string;
        code: string;
    }
}

export interface DatabaseInsertError {
    code: number;
    data: DatabaseInsertDataError;
    message: string;
}