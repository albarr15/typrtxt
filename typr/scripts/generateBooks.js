import fs from "fs";
import path from "path";

const folderPath = "public/books";
const outputPath = "public/booksList.json";

function scanFolder(folder) {
  return fs.readdirSync(folder).map((file) => ({
    name: file,
    path: path.join("/books", file),
  }));
}

const fileList = scanFolder(folderPath);
fs.writeFileSync(outputPath, JSON.stringify(fileList, null, 2));
console.log("Finished generating booksList.json");
