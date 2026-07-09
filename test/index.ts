import * as $ from "@dz-ssbm/util";
import * as H2H from "../src/node-index.js";

async function main() {
  const client = H2H.Client({
    authToken: process.env.CLM_STATS_GG_AUTH!,
    cachePath: "/home/dz/Projects/dz-deno-apps/dz-deno/h2h/.cache-path",
    log: console.log,
  });
  const res = await $.execAsync(() =>
    H2H.getRankings(
      [
        // H2H.Source.challonge("tz6op7p6"),
        H2H.Source.challonge("840lhvjn"),
        // H2H.Source.startgg("tournament/rpm-97/event/melee-singles"),
      ],
      client,
    ),
  );
  console.log(res);
}

main()
  .then(() => process.exit())
  .catch((e) => {
    console.error("Uncaught error!");
    console.error(e);
    process.exit(1);
  });
