export interface OutdatedPackage {
    readonly name: string;
    readonly latest: string;
}

export function toOutdatedPackages(stdout: string[]): OutdatedPackage[] {
    const result: OutdatedPackage[] = [];

    for (const line of stdout) {
        const trimedLine = line.trim();
        if (trimedLine.startsWith(">") == false) {
            continue;
        }

        const ar = trimedLine.split(/\s/);
        if (ar.length < 5) {
            continue;
        }

        const name = ar[1];
        const latest = ar[ar.length - 1];

        if (result.find((x) => x.name == name) != undefined) {
            continue;
        }

        result.push({ name: name, latest: latest });
    }

    return result;
}
