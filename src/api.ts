import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const { SNYK_TOKEN } = process.env;
if (!SNYK_TOKEN) {
  throw new Error("SNYK_TOKEN missing");
}
const apiBase = "https://api.snyk.io/api/v1";

// FIXME DEV ONLY: remove most projects from our org so I'm only modifying a couple
const includedProjects = [
  "cultureamp/frontend-ops:package.json",
  "cultureamp/frontend-ops:packages/frontend-svg-util/package.json",
];

const headers = { Authorization: `token ${SNYK_TOKEN}` };

export const api = {
  /** list projects in an org */
  listProjects: async (orgId: string): Promise<Project[]> => {
    const res = await axios.get(`${apiBase}/org/${orgId}/projects`, {
      headers,
    });
    return res.data.projects.filter((project: { name: string }) =>
      includedProjects.includes(project.name)
    );
  },

  /** list existing ignores for a project */
  listIgnores: async (
    orgId: string,
    projectId: string
  ): Promise<IgnoredIssues> => {
    const ignores = await axios.get(
      `${apiBase}/org/${orgId}/project/${projectId}/ignores`,
      { headers }
    );
    return ignores.data;
  },
};
