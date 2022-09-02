export type Ignore = {
  issueId: string;
  /** IDEA defaults to "*" if blank */
  ignorePath: string;
  reasonType: "not-vulnerable" | "wont-fix" | "temporary-ignore";
  /** optional in the api, but should we make it required? */
  reason?: string;
  /** I don't think we have any use for this now, should we not expose it for now? */
  expires?: string;
};

export type Config = {
  orgs: Array<{
    /** a uuid from snyk dashboard */
    id: string;
    /** name for docs, not used by this script */
    name: string;
    /** the list of ignore to sync with snyk's database */
    ignores: Ignore[];
    // IDEA: we could allow project specific ignoring as well
  }>;
};

export type Project = {
  id: string;
  name: string;
};

export type IgnoredIssues = {
  [issueId: string]: Array<{
    [path: string]: {
      reason: string;
      created: string;
      ignoredBy: {
        id: string;
        name: string;
        email: string;
      };
      reasonType: "not-vulnerable" | "wont-fix" | "temporary-ignore";
      disregardIfFixable: boolean;
    };
  }>;
};
