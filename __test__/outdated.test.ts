import { OutdatedPackage, toOutdatedPackages } from "../src/outdated";

test("parse", () => {
    const stdout = `The following sources were used:
   https://api.nuget.org/v3/index.json

Project \`SentimentAnalysis\` has the following updates to its packages
   [netcoreapp2.1]:
   Top-level Package      Requested   Resolved   Latest
   > Microsoft.ML         0.11.0      0.11.0     1.0.0-preview`.split("\n")

    const result = toOutdatedPackages(stdout);
    expect(result.length).toBe(1);

    expect(result[0].name).toBe("Microsoft.ML");
    expect(result[0].latest).toBe("1.0.0-preview");
})