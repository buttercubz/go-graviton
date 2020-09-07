import path from "path";
import os from "os";

function Platform() {
  switch (os.platform()) {
    case "win32":
      return path.join(__dirname, "bin", "win-go-langserver.exe");

    case "linux":
      return path.join(__dirname, "bin", "linux-go-langserver");

    case "darwin":
      return path.join(__dirname, "bin", "darwin-go-langserver");

    default:
      throw new Error("Platform not supported.");
  }
}

export function entry({ RunningConfig }) {
  RunningConfig.emit("registerLanguageServer", {
    modes: ["go"],
    args: [
      Platform(),
      "-gocodecompletion",
      "-func-snippet-enabled",
      "-diagnostics",
    ],
  });
}
