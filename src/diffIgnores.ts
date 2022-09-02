import { Ignore, IgnoredIssues } from "./types";

type DiffIgnoresResult = {
  toCreate: Ignore[];
  toDelete: string[];
};

/**
 * `diffIgnores` specified ignores and existing ones and returns lists
 * to act on intentionally left as very imperitive for now while I
 * work out the details
 */
export function diffIgnores(
  specifiedIgnores: Ignore[],
  existingIgnores: IgnoredIssues
): DiffIgnoresResult {
  const toCreate: Ignore[] = [];
  const toDelete: string[] = [];

  // find specified ignores that don't exist and need to be created
  // also find ones that need to exist, but are different from what's there
  for (const specifiedIgnore of specifiedIgnores) {
    const existingMatch = Object.entries(existingIgnores).find(
      ([key]) => key === specifiedIgnore.issueId
    );
    if (!existingMatch) {
      toCreate.push(specifiedIgnore);
    } else if (!existingMatchesSpec(...existingMatch, specifiedIgnores)) {
      toDelete.push(specifiedIgnore.issueId);
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

  return { toCreate, toDelete };
}

export function existingMatchesSpec(
  issueId: string,
  existingIssues: IgnoredIssues[string],
  specifiedIgnores: Ignore[]
) {
  const equalOrFalsy = (x: unknown, y: unknown) => (!x && !y) || x === y;

  for (const [ignorePath, existing] of existingIssues.flatMap(Object.entries)) {
    const spec = specifiedIgnores.find(
      (i) => i.issueId === issueId && i.ignorePath === ignorePath
    );

    if (
      !spec ||
      !equalOrFalsy(existing.reason, spec?.reason) ||
      !equalOrFalsy(existing.reasonType, spec?.reasonType)
    ) {
      return false;
    }
  }

  return true;
}
