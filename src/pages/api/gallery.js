import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const baseDir = path.join(process.cwd(), "public", "gallery");

  const folders = ["eyes", "faces", "titans", "visuals", "bodyparts"];

  const gallery = {};

  folders.forEach((folder) => {
    const folderPath = path.join(baseDir, folder);

    gallery[folder] = fs
      .readdirSync(folderPath)
      .filter((file) =>
        /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
      )
      .map((file) => `/gallery/${folder}/${file}`);
  });

  res.status(200).json(gallery);
}