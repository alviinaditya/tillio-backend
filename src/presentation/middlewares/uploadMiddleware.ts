import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import ResponseError from "../../shared/errors/ResponseError";
import { BAD_REQUEST } from "../../shared/constants/httpStatusCode";

const createUploadMiddleware = (customDir: string) => {
  const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      // Construct the full directory path
      const dirPath = path.join(__dirname, "../../public/", customDir);

      // Ensure the directory exists
      fs.mkdirSync(dirPath, { recursive: true });

      // Set the directory
      cb(null, dirPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(
        new ResponseError(
          BAD_REQUEST,
          "Only images are allowed (jpeg, jpg, png, gif)"
        )
      );
    }
  };

  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    fileFilter,
  });
};

export default createUploadMiddleware;
