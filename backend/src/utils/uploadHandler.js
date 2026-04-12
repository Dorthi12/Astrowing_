import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { HTTP_STATUS } from "../config/constants.js";

// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "botrush/posts",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    resource_type: "auto",
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export const uploadImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    res.json({
      success: true,
      imageUrl: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};
