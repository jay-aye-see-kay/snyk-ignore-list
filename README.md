# snyk-ignore-list
Proof of concept investigating what a script that sync'd a list of ignores with multiple projects using Snyk's api.

Currently just takes and list of ignores and an org. Then diffs ignores that exist in Snyk with ones that are specified here.

Next steps would be making it consider changed ignores when diffing and implementing the actual create, delete, and update api calls.

## Usage

Get a `SNYK_TOKEN` from [your snyk account page](https://app.snyk.io/account/) and put it in `.env`

``` shell
# install
yarn

# run the main script (will calc diffs and print, will not make any real changes yet)
yarn ts-node ./src/main.ts
```
