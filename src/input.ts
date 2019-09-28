import * as core from "@actions/core";
import * as os from "os";

export function getInputStringArray(
    name: string,
    required = false
): string[] | null {
    let result: string[] | null = core
        .getInput(name, { required: required })
        .split(os.EOL)
        .map(x => x.trim());
    if (result.length == 1 && result[0].length == 0) {
        result = null;
    }

    return result;
}

export function getInputString(name: string, required = false): string | null {
    let result: string | null = core.getInput(name, { required: required });
    if (result.length == 0) {
        result = null;
    }

    return result;
}

export function getInputBoolean(
    name: string,
    required = false,
    defaultValue = false
): boolean {
    const value = core.getInput(name, { required: required });

    if (value == "true") {
        return true;
    } else if (value == "false") {
        return false;
    }

    return defaultValue;
}
