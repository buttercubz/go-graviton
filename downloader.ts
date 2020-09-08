import {
  DownloaderHelper,
  Stats,
  DownloaderError,
} from "node-downloader-helper";
import path from "path";
import os from "os";
import fs from "fs";

type Platform = "win" | "linux" | "darwin";

const Platforms = {
	darwin: "macOS",
	linux: "Linux",
	win32: "Windows"
}

function download(platform: Platform, { StatusBarItem, Notification }: any) {
  const dl = new DownloaderHelper(
    `https://github.com/marc2332/go-graviton/releases/download/go-langserverbf346405417c9f3f1e3f3370381b045c00bbc2bc/go-langserver_${Platforms[platform]}`,
    path.join(__dirname, "bin")
  );

  const barItem = new StatusBarItem({
    label: "Downloading",
    hint: "Downloading the binaries",
    important: true,
  });

  dl.start();

  // * when download is ending
  dl.on("end", () => {
    barItem.setLabel("Download Completed");
    new Notification({
      title: "Go",
      content: "Download Completed, please restart graviton",
      lifeTime: 9000,
    });
    setTimeout(() => {
      barItem.hide();
    }, 3000);
  });

  // * show progress download
  dl.on("progress", (ld: Stats) => {
    barItem.setLabel(`Downloading ${Math.round(ld.progress)} %`);
  });

  // * show a any error
  dl.on("error", (err: DownloaderError) => {
    barItem.setLabel("download error");

    setTimeout(() => {
      barItem.hide();
    }, 500);

    const notify = new Notification({
      title: "Go (download error)",
      content: err.message,
      lifeTime: Infinity,
      buttons: [
        {
          label: "try again",
          action() {
            // * delete old bin folder
            fs.rmdirSync(path.join(__dirname, "bin"));
            fs.mkdirSync(path.join(__dirname, "bin"));

            // * try to download again
            download(platform, { StatusBarItem, Notification });
          },
        },
        {
          label: "Later",
          action() {
            notify.remove();
            barItem.hide();
          },
        },
      ],
    });
  });
}

function getOS(): { platform: Platform; path: string } {
  switch (os.platform()) {
    case "win32":
      return {
        platform: "win",
        path: path.join(__dirname, "bin", "win-go-langserver.exe"),
      };

    case "linux":
      return {
        platform: "linux",
        path: path.join(__dirname, "bin", "linux-go-langserver"),
      };

    case "darwin":
      return {
        platform: "darwin",
        path: path.join(__dirname, "bin", "darwin-go-langserver"),
      };

    default:
      throw new Error("Platform not supported.");
  }
}

export { download, getOS };
