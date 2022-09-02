import { diffIgnores } from "./diffIgnores";
import { Ignore, IgnoredIssues } from "./types";

const ONE_EXISTING_ISSUE = {
  "SNYK-JS-NWSAPI-2841516": [
    {
      "*": {
        reason: "",
        created: "2022-08-31T07:05:34.723Z",
        ignoredBy: { id: "x", name: "x", email: "x" },
        reasonType: "not-vulnerable" as const,
        disregardIfFixable: false,
      },
    },
  ],
};

const SPECIFIED_ISSUE_1 = {
  ignorePath: "*",
  issueId: "SNYK-JS-NWSAPI-2841516",
  reasonType: "not-vulnerable" as const,
};

describe("diffIgnores() can list ignores to update or delete", () => {
  it("returns nothing when passed nothing", () => {
    const specified: Ignore[] = [];
    const existing: IgnoredIssues = {};

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [],
      toDelete: [],
      toUpdate: [],
    });
  });

  it("does nothing when specified and existing match", () => {
    const specified = [SPECIFIED_ISSUE_1];
    const existing = ONE_EXISTING_ISSUE;

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [],
      toDelete: [],
      toUpdate: [],
    });
  });

  it("returns ids to delete if not specified", () => {
    const specified: Ignore[] = [];
    const existing = ONE_EXISTING_ISSUE;

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [],
      toDelete: ["SNYK-JS-NWSAPI-2841516"],
      toUpdate: [],
    });
  });
});
