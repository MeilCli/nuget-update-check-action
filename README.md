# nuget-update-check-action
[![CI-Master](https://github.com/MeilCli/nuget-update-check-action/actions/workflows/ci-master.yml/badge.svg)](https://github.com/MeilCli/nuget-update-check-action/actions/workflows/ci-master.yml)  
nuget new package version check action for GitHub Actions.

## Required
This action must execute after [setup-dotnet](https://github.com/actions/setup-dotnet) and `dotnet restore`.

.NET Core version is required 2.2 or higher.

## Example
Slack notification example, using [8398a7/action-slack](https://github.com/8398a7/action-slack):

```yaml
name: Check Package

on: 
  schedule:
    - cron: '0 8 * * 5' # every friday AM 8:00
jobs:
  nuget:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '3.0.100'
    - run: dotnet restore
    - uses: MeilCli/nuget-update-check-action@v4
      id: outdated
    - uses: 8398a7/action-slack@v2
      if: steps.outdated.outputs.has_nuget_update != 'false'
      with:
        status: ${{ job.status }}
        text: ${{ steps.outdated.outputs.nuget_update_text }}
        author_name: GitHub Actions
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
You can also pin to a [specific release](https://github.com/MeilCli/nuget-update-check-action/releases) version in the format `@v4.x.x`

## input
- `project_or_solution_files`
  - optional
  - target project or solution files
  - if multiple files, write multiline
- `config`
  - optional
  - The NuGet sources to use when searching for newer packages
- `source`
  - optional
  - The NuGet sources to use when searching for newer packages
- `frameworks`
  - Displays only the packages applicable for the specified target framework
  - if multiple files, write multiline
- `highest_minor`
  - optional
  - Considers only the packages with a matching major version number when searching for newer packages
  - value: `true` or `false`, default: `false`
- `highest_patch`
  - optional
  - Considers only the packages with a matching major and minor version numbers when searching for newer packages
  - value: `true` or `false`, default: `false`
- `include_prerelease`
  - optional
  - Considers packages with prerelease versions when searching for newer packages
  - value: `true` or `false`, default: `false`

## output
- `has_nuget_update`
  - has new package version information
  - value: `true` or `false`
- `nuget_update_text`
  - new package version information text
- `nuget_update_json`
  - new package version information json

## Contributes
[<img src="https://gist.github.com/MeilCli/9be950d02fa29fb64832a61b87b9618f/raw/f7bbb334deca6e35018799d9f21239f3c47b7872/metrics_contributors.svg">](https://github.com/MeilCli/nuget-update-check-action/graphs/contributors)

### Could you want to contribute?
see [Contributing.md](./.github/CONTRIBUTING.md)

## License
[<img src="https://gist.github.com/MeilCli/9be950d02fa29fb64832a61b87b9618f/raw/f7bbb334deca6e35018799d9f21239f3c47b7872/metrics_licenses.svg">](LICENSE)
