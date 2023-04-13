import {DatabaseInsertDataError} from "../types/Errors";

export default function ErrorsAsStringDict(errors: DatabaseInsertDataError): { [key: string]: string } {
    // dict of error => message
    const errorsDict: { [key: string]: string } = {};

    // loop through the errors
    for (const key in errors) {
        if (!Object.hasOwn(errors, key)) continue;

        // get the error
        const error = errors[key];

        // add the error to the dict
        errorsDict[key] = error.message;
    }

    return errorsDict;
}