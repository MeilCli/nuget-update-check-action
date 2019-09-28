"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const os = __importStar(require("os"));
function getInputStringArray(name, required = false) {
    let result = core
        .getInput(name, { required: required })
        .split(os.EOL)
        .map(x => x.trim());
    if (result.length == 1 && result[0].length == 0) {
        result = null;
    }
    return result;
}
exports.getInputStringArray = getInputStringArray;
function getInputString(name, required = false) {
    let result = core.getInput(name, { required: required });
    if (result.length == 0) {
        result = null;
    }
    return result;
}
exports.getInputString = getInputString;
function getInputBoolean(name, required = false, defaultValue = false) {
    const value = core.getInput(name, { required: required });
    if (value == "true") {
        return true;
    }
    else if (value == "false") {
        return false;
    }
    return defaultValue;
}
exports.getInputBoolean = getInputBoolean;
