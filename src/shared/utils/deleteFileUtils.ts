import path from "path";
import fs from "fs";
import { logger } from "../providers/LoggerProvider";

/**
 * Deletes a file in the `public` directory.
 * @param relativeFilePath - The relative path to the file from the `public` directory.
 * @returns A Promise that resolves when the file is deleted, or skips if the file does not exist.
 */
const deletePublicFile = (relativeFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../../public", relativeFilePath);

    fs.unlink(filePath, (err) => {
      if (!err) {
        logger.info(`File deleted: ${filePath}`);
        return resolve();
      }

      if (err.code === "ENOENT") {
        logger.info(`File not found: ${filePath}`);
        return resolve();
      }
      return reject(err);
    });
  });
};

export default deletePublicFile;
