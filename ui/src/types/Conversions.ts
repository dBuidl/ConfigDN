import {tFlagType} from "./Structures";

export function fieldTypeToInputType(fieldType: tFlagType): "checkbox" | "text" | "number" {
    switch (fieldType) {
        case "boolean":
            return "checkbox";
        case "string":
            return "text";
        case "number":
            return "number";
        case "json":
            return "text";
        case "array":
            return "text";
        default:
            return "text";
    }
}