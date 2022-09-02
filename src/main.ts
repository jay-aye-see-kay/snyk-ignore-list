import { api } from "./api";
import { Config } from "./types";
import { diffIgnores } from "./diffIgnores";

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

async function main() {
  for (const org of config.orgs) {
    const projects = await api.listProjects(org.id);

    for (const project of projects) {
      const existingIgnores = await api.listIgnores(org.id, project.id);
      const { toCreate, toDelete } = diffIgnores(org.ignores, existingIgnores);
      console.log(`Ignores for ${project.name}`, { toCreate, toDelete });
      // FIXME make api requests to actually create and delete issues for each project
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
