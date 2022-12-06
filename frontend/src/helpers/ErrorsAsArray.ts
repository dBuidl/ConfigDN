import SentenceCase from "./SentenceCase";
import {DatabaseInsertDataError} from "../types/Errors";

export default function ErrorsAsArray(errors: DatabaseInsertDataError): string[] {
    // take errors key, sentance case it, add the .message to it and add it to the array
    return Object.keys(errors).map(key => {
        return `${SentenceCase(key)} ${errors[key].message.toLowerCase()}`;
    })
}