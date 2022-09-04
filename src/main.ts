import { api } from "./api";
import { Config } from "./types";
import { diffIgnores } from "./diffIgnores";

// config for a project
const config: Config = {
  orgs: [
    {
      id: "2045da25-ec7c-4a58-90ac-c50b512033ca",
      name: "Front End Foundations",
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

      console.log(`\nDeleting ${toDelete.length} ignores...`);
      for (const toDel of toDelete) {
        await api.deleteIgnore(org.id, project.id, toDel);
        console.log(`All ignores for issue ${toDel} deleted`);
      }

      console.log(`\nCreating ${toCreate.length} ignores...`);
      for (const toCre of toCreate) {
        await api.createIgnore(org.id, project.id, toCre);
        console.log(
          `Ignore created for issue: ${toCre.issueId}, with ignorePath: ${toCre.ignorePath}`
        );
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
