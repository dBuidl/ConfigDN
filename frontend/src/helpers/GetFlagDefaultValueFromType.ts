import {tFlagType} from "../types/Structures";

export default function GetFlagDefaultValueFromType(type: tFlagType) {
    switch (type) {
        case "boolean":
            return false;
        case "number":
            return 0;
        case "string":
            return "";
        case "json":
            return {};
        case "array":
            return [];
    }
}