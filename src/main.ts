import { api, IgnoredIssues } from "./api";

type Ignore = {
  issueId: string;
  /** IDEA defaults to "*" if blank */
  ignorePath: string;
  reasonType: "not-vulnerable" | "wont-fix" | "temporary-ignore";
  /** optional in the api, but should we make it required? */
  reason?: string;
  /** I don't think we have any use for this now, should we not expose it for now? */
  expires?: string;
};

type Config = {
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

// config for a project
const config: Config = {
  orgs: [
    {
      id: "2045da25-ec7c-4a58-90ac-c50b512033ca",
      name: "Front End Foundations",
      // change this format to match the one returned by the api so they're easier to compare (also this can't do multiple ignores per)
      ignores: [
        {
          issueId: "SNYK-JS-NWSAPI-2841516",
          ignorePath: "*",
          reasonType: "not-vulnerable",
          reason: "test ignore",
        },
      ],
    },
  ],
};

/** diff specified ignores and existing ones and returns lists to act on
 intentionally left as very imperitive for now while I work out the details */
function diff(speccedIgnores: Ignore[], existingIgnores: IgnoredIssues) {
  const toCreate: Ignore[] = [];
  const toDelete: string[] = [];

  // find specced ignores that don't exist and need to be created
  for (const speccedIgnore of speccedIgnores) {
    const matching = Object.entries(existingIgnores).find(
      ([key]) => key === speccedIgnore.issueId
    );
    if (!matching) {
      toCreate.push(speccedIgnore);
    }
  }

  // find existing ignores that aren't specced and need to be deleted
  for (const [existingIssueId] of Object.entries(existingIgnores)) {
    const matching = speccedIgnores.find(
      (specced) => specced.issueId === existingIssueId
    );
    if (!matching) {
      toDelete.push(existingIssueId);
    }
  }

  // FIXME doesn't account for ignores that need updating
  return { toCreate, toDelete, toUpdate: [] };
}

async function main() {
  for (const org of config.orgs) {
    const projects = await api.listProjects(org.id);

    for (const project of projects) {
      const existingIgnores = await api.listIgnores(org.id, project.id);
      const { toCreate, toDelete } = diff(org.ignores, existingIgnores);
      console.log(`Ignores for ${project.name}`, { toCreate, toDelete });
      // FIXME make api requests to actually create and delete issues for each project
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
