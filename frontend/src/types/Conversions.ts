import {tFlagType} from "./Structures";

export function fieldTypeToInputType(fieldType: tFlagType): string {
    switch (fieldType) {
        case "boolean":
            return "checkbox";
        case "string":
            return "text";
        case "number":
            return "number";
        case "json":
            return "textarea";
        case "array":
            return "textarea";
        default:
            return "text";
    }
}