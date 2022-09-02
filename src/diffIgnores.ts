import { Ignore, IgnoredIssues } from "./types";

type DiffIgnoresResult = {
  toCreate: Ignore[];
  toDelete: string[];
  toUpdate: never[];
};

/**
 * `diffIgnores` specified ignores and existing ones and returns lists
 * to act on intentionally left as very imperitive for now while I
 * work out the details
 **/
export function diffIgnores(
  specifiedIgnores: Ignore[],
  existingIgnores: IgnoredIssues
): DiffIgnoresResult {
  const toCreate: Ignore[] = [];
  const toDelete: string[] = [];

  // find specified ignores that don't exist and need to be created
  for (const specifiedIgnore of specifiedIgnores) {
    const matching = Object.entries(existingIgnores).find(
      ([key]) => key === specifiedIgnore.issueId
    );
    if (!matching) {
      toCreate.push(specifiedIgnore);
    }
  }

  // find existing ignores that aren't specified and need to be deleted
  for (const [existingIssueId] of Object.entries(existingIgnores)) {
    const matching = specifiedIgnores.find(
      (specified) => specified.issueId === existingIssueId
    );
    if (!matching) {
      toDelete.push(existingIssueId);
    }
  }

  // FIXME doesn't account for ignores that need updating
  return { toCreate, toDelete, toUpdate: [] };
}
