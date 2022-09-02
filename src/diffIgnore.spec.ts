import { diffIgnores, existingMatchesSpec } from "./diffIgnores";
import { Ignore, IgnoredIssues } from "./types";

/**
 * setup
 */
//
const ISSUE_ID = "SNYK-JS-NWSAPI-2841516";

const ONE_EXISTING_ISSUE = {
  [ISSUE_ID]: [
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

const ONE_EXISTING_ISSUE_TWO_PATHS = {
  [ISSUE_ID]: [
    {
      "jest > lodash": {
        reason: "",
        created: "2022-08-31T07:05:34.723Z",
        ignoredBy: { id: "x", name: "x", email: "x" },
        reasonType: "not-vulnerable" as const,
        disregardIfFixable: false,
      },
    },
    {
      "webpack > lodash": {
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
  issueId: ISSUE_ID,
  reasonType: "not-vulnerable" as const,
};

const SPECIFIED_ISSUE_2 = {
  ignorePath: "jest > lodash",
  issueId: ISSUE_ID,
  reasonType: "not-vulnerable" as const,
};

const SPECIFIED_ISSUE_3 = {
  ignorePath: "webpack > lodash",
  issueId: "SNYK-JS-NWSAPI-2841516",
  reasonType: "not-vulnerable" as const,
};

/**
 * Testing the main function diffIgnores
 */
describe("diffIgnores() can list ignores to update or delete", () => {
  it("returns nothing when passed nothing", () => {
    const specified: Ignore[] = [];
    const existing: IgnoredIssues = {};

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [],
      toDelete: [],
    });
  });

  it("does nothing when specified and existing match", () => {
    const specified = [SPECIFIED_ISSUE_1];
    const existing = ONE_EXISTING_ISSUE;

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [],
      toDelete: [],
    });
  });

  it("returns ids to delete if not specified", () => {
    const specified: Ignore[] = [];
    const existing = ONE_EXISTING_ISSUE;

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [],
      toDelete: ["SNYK-JS-NWSAPI-2841516"],
    });
  });

  it("returns toCreate if not exists", () => {
    const specified = [SPECIFIED_ISSUE_1];
    const existing: IgnoredIssues = {};

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: [SPECIFIED_ISSUE_1],
      toDelete: [],
    });
  });

  it("when an issue has new path it goes in toDelete and toCreate", () => {
    const newIgnorePath = "jest > is-even";
    const specified = [{ ...SPECIFIED_ISSUE_1, ignorePath: newIgnorePath }];
    const existing = ONE_EXISTING_ISSUE;

    expect(diffIgnores(specified, existing)).toEqual({
      toCreate: specified,
      toDelete: [SPECIFIED_ISSUE_1.issueId],
    });
  });
});

/**
 * Testing the helper function existingMatchesSpec
 */
describe("existingMatchesSpec()", () => {
  it("issueId is specified and exists but different ignorePaths", () => {
    const specified = [SPECIFIED_ISSUE_2];
    const existing = ONE_EXISTING_ISSUE_TWO_PATHS[
      ISSUE_ID
    ] as unknown as IgnoredIssues[string];

    expect(existingMatchesSpec(ISSUE_ID, existing, specified)).toEqual(false);
  });

  it("issueId is specified and exists with the same ignorePaths", () => {
    const specified = [SPECIFIED_ISSUE_2, SPECIFIED_ISSUE_3];
    const existing = ONE_EXISTING_ISSUE_TWO_PATHS[
      ISSUE_ID
    ] as unknown as IgnoredIssues[string];

    expect(existingMatchesSpec(ISSUE_ID, existing, specified)).toEqual(true);
  });

  it("issueId is specified and exists but reason types given are different", () => {
    const specified = [
      { ...SPECIFIED_ISSUE_2, reasonType: "wont-fix" as const },
      { ...SPECIFIED_ISSUE_3, reasonType: "wont-fix" as const },
    ];
    const existing = ONE_EXISTING_ISSUE_TWO_PATHS[
      ISSUE_ID
    ] as unknown as IgnoredIssues[string];

    expect(existingMatchesSpec(ISSUE_ID, existing, specified)).toEqual(false);
  });

  it("issueId is specified and exists but reasons given are different", () => {
    const specified = [
      { ...SPECIFIED_ISSUE_2, reason: "new reason" },
      { ...SPECIFIED_ISSUE_3 },
    ];
    const existing = ONE_EXISTING_ISSUE_TWO_PATHS[
      ISSUE_ID
    ] as unknown as IgnoredIssues[string];

    expect(existingMatchesSpec(ISSUE_ID, existing, specified)).toEqual(false);
  });
});
