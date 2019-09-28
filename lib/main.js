"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const os = __importStar(require("os"));
const input_1 = require("./input");
const outdated_1 = require("./outdated");
function getOption() {
    return {
        projectOrSolutionFiles: input_1.getInputStringArray("project_or_solution_files"),
        config: input_1.getInputString("config"),
        source: input_1.getInputString("source"),
        frameworks: input_1.getInputStringArray("frameworks"),
        highestMinor: input_1.getInputBoolean("highest_minor"),
        highestPatch: input_1.getInputBoolean("highest_patch"),
        includePreRelease: input_1.getInputBoolean("include_prerelease")
    };
}
function checkEnvironment() {
    return __awaiter(this, void 0, void 0, function* () {
        yield io.which("dotnet", true);
    });
}
function executeOutdated(projectOrSolutionFile, option) {
    return __awaiter(this, void 0, void 0, function* () {
        const execOption = {};
        let stdout = "";
        execOption.listeners = {
            stdout: (data) => {
                stdout += data.toString();
            }
        };
        const args = [];
        if (projectOrSolutionFile != null) {
            args.push(projectOrSolutionFile);
        }
        args.push("package");
        if (option.config != null) {
            args.push("--config");
            args.push(option.config);
        }
        if (option.source != null) {
            args.push("--source");
            args.push(option.source);
        }
        if (option.frameworks != null) {
            for (const framework of option.frameworks) {
                if (framework.length == 0) {
                    continue;
                }
                args.push("--framework");
                args.push(framework);
            }
        }
        if (option.highestMinor) {
            args.push("--highest-minor");
        }
        if (option.highestPatch) {
            args.push("--highest-patch");
        }
        if (option.includePreRelease) {
            args.push("--include-prerelease");
        }
        yield exec.exec("dotnet list", args, execOption);
        return outdated_1.toOutdatedPackages(stdout.split("\n"));
    });
}
function convertToOutputText(outdatedPackages) {
    let result = "";
    for (const outdatedPackage of outdatedPackages) {
        if (0 < result.length) {
            result += os.EOL;
        }
        result += `${outdatedPackage.name}: new version ${outdatedPackage.latest}`;
    }
    return result;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkEnvironment();
            const option = getOption();
            const result = [];
            if (option.projectOrSolutionFiles == null) {
                const packages = yield executeOutdated(null, option);
                packages.forEach(x => result.push(x));
            }
            else {
                for (const projectOrSolutionFile of option.projectOrSolutionFiles) {
                    const packages = yield executeOutdated(projectOrSolutionFile, option);
                    packages.forEach(x => result.push(x));
                }
            }
            const outputText = convertToOutputText(result);
            core.setOutput("has_nuget_update", result.length == 0 ? "false" : "true");
            core.setOutput("nuget_update_text", outputText);
            core.setOutput("nuget_update_json", JSON.stringify(result));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
