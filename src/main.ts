import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as os from "os";
import { getInputStringArray, getInputString, getInputBoolean } from "./input";
import { ExecOptions } from "@actions/exec/lib/interfaces";
import { toOutdatedPackages, OutdatedPackage } from "./outdated";

interface Option {
    readonly projectOrSolutionFiles: string[] | null;
    readonly config: string | null;
    readonly source: string | null;
    readonly frameworks: string[] | null;
    readonly highestMinor: boolean;
    readonly highestPatch: boolean;
    readonly includePreRelease: boolean;
}

function getOption(): Option {
    return {
        projectOrSolutionFiles: getInputStringArray(
            "project_or_solution_files"
        ),
        config: getInputString("config"),
        source: getInputString("source"),
        frameworks: getInputStringArray("frameworks"),
        highestMinor: getInputBoolean("highest_minor"),
        highestPatch: getInputBoolean("highest_patch"),
        includePreRelease: getInputBoolean("include_prerelease")
    };
}

async function checkEnvironment() {
    await io.which("dotnet", true);
}

async function executeOutdated(
    projectOrSolutionFile: string | null,
    option: Option
) {
    const execOption: ExecOptions = {};
    let stdout = "";
    execOption.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString();
        }
    };

    const args: string[] = [];
    if (projectOrSolutionFile != null) {
        args.push(projectOrSolutionFile);
    }
    args.push("package");
    args.push("--outdated");
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

    await exec.exec("dotnet list", args, execOption);

    return toOutdatedPackages(stdout.split("\n"));
}

function convertToOutputText(outdatedPackages: OutdatedPackage[]): string {
    let result = "";
    for (const outdatedPackage of outdatedPackages) {
        if (0 < result.length) {
            result += os.EOL;
        }
        result += `${outdatedPackage.name}: new version ${outdatedPackage.latest}`;
    }
    return result;
}

async function run() {
    try {
        await checkEnvironment();
        const option = getOption();

        const result: OutdatedPackage[] = [];
        if (option.projectOrSolutionFiles == null) {
            const packages = await executeOutdated(null, option);
            packages.forEach(x => result.push(x));
        } else {
            for (const projectOrSolutionFile of option.projectOrSolutionFiles) {
                const packages = await executeOutdated(
                    projectOrSolutionFile,
                    option
                );
                packages.forEach(x => result.push(x));
            }
        }

        const outputText = convertToOutputText(result);
        core.setOutput(
            "has_nuget_update",
            result.length == 0 ? "false" : "true"
        );
        core.setOutput("nuget_update_text", outputText);
        core.setOutput("nuget_update_json", JSON.stringify(result));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
