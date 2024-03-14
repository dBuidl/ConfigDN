import {ClientResponseError} from "pocketbase";

export default function ErrorsAsStringDict(errors: any): { [key: string]: string } {
    if (errors instanceof ClientResponseError) {
        let unwrappedError = errors.data;

        // dict of error => message
        const errorsDict: { [key: string]: string } = {};

        // loop through the errors
        for (const key in unwrappedError.data) {
            if (!Object.hasOwn(unwrappedError.data, key)) continue;

            // get the error
            const error = unwrappedError.data[key];

            // add the error to the dict
            errorsDict[key] = GetErrorText(error);
        }

        // if it's a generic error due to a field, just ignore it so as not to confuse the user
        if (errors.message !== "Something went wrong while processing your request.") {
            errorsDict.form = errors.message;
        }

        return errorsDict;
    } else if (errors instanceof Error) {
        return {"form": errors.message};
    } else {
        return {"form": "An unknown error occurred."};
    }
}

function GetErrorText(error: any) {
    // Ensure that error is an object and has a property 'code'
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return "An unexpected error occurred.";
    }

    switch (true) {
        case error.code === "validation_invalid_token":
            return "Invalid token. Please request a new password reset link.";
        default:
            // Ensure error.message is a string otherwise return a generic message
            return (typeof error.message === 'string') ? error.message : "An error occurred, but no additional information is available.";
    }
}