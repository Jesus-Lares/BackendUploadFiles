const express = require("express");
const fileUpload = require("express-fileupload");

const FilesController = require("../controllers/files");

const api = express.Router();
api.use(fileUpload());

api.post("/upload-file/:path?", FilesController.uploadFile);
api.get("/files/:path?", FilesController.getContent);
api.post("/files/:path?", FilesController.createDir);
api.put("/files/:oldPath?", FilesController.moveFileDir);
api.delete("/files/:oldPath?", FilesController.deleteFile);

module.exports = api;
