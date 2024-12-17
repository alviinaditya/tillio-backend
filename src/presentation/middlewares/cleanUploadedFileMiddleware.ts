import { ErrorRequestHandler } from "express";
import fs from "fs";
import { logger } from "../../shared/providers/LoggerProvider";

const cleanUploadedFile: ErrorRequestHandler = (error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        logger.error(`Error deleting file: ${err.message} (code: ${err.code})`);
      }
    });
  }
  next(error);
};

export default cleanUploadedFile;
