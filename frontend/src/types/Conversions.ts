import {tFlagType} from "./Structures";

export function fieldTypeToInputType(fieldType: tFlagType): "checkbox" | "text" | "number" | "textarea" {
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