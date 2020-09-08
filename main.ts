import { download, getOS } from "./downloader";
import path from "path";
import fs from "fs";

export function entry({ RunningConfig, Notification, StatusBarItem }: any) {
  const binDir = fs.existsSync(path.join(__dirname, "bin"));

  // * if binary or bin dir not exist
  if (!binDir || !fs.existsSync(getOS().path)) {
    if (!binDir) {
      fs.mkdirSync(path.join(__dirname, "bin"), { recursive: true });
    }

    const notify = new Notification({
      title: "Go",
      content:
        "Go plugin need to download some necessary files",
      lifeTime: Infinity,
      buttons: [
        {
          label: "Download",
          action() {
            download(getOS().platform, { Notification, StatusBarItem });
          },
        },
        {
          label: "Later",
          action() {
            notify.remove();
          },
        },
      ],
    });
  }

  else {
    RunningConfig.emit("registerLanguageServer", {
      modes: ["go"],
      args: [
        getOS().path,
        "-gocodecompletion",
        "-func-snippet-enabled",
        "-diagnostics",
      ],
    });
  }
}
