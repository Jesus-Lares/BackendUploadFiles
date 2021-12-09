const fs = require("fs");
const path = require("path");
const processPath = require("../services/path");
const moveFile = require("../services/mv");

const uploadFile = async (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ success: false, message: "No se cargo ningun archivo." });
  }

  let dirPath = processPath(req.params.path);
  let files = req.files.file;

  console.log(dirPath);
  if (!Array.isArray(files)) {
    files = [files];
  }

  try {
    for (const file of files) {
      await moveFile(file, dirPath.absolutePath);
    }
  } catch (err) {
    if (err.code) {
      console.log(err);
      return next(err);
    }

    return res.status(400).json({
      success: false,
      message: err.message,
      path: dirPath.relativePath,
    });
  }
  res.json({
    success: true,
    message: "Archivo subido con exito",
    path: dirPath.relativePath,
  });
};

const getContent = async (req, res, next) => {
  try {
    const dirPath = processPath(req.params.path);
    const dir = await fs.promises.opendir(dirPath.absolutePath);
    const content = { files: [], directories: [] };

    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        content.directories.push(dirent.name);
      } else {
        content.files.push(dirent.name);
      }
    }
    content.directories.sort();
    content.files.sort();

    res.json({ path: dirPath.relativePath, content, success: true });
  } catch (err) {
    next(err);
  }
};

const createDir = async (req, res, next) => {
  const dirPath = processPath(req.params.path);
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Nombre no especificado",
    });
  }

  try {
    await fs.promises.mkdir(path.join(dirPath.absolutePath, name));
  } catch (e) {
    if (e.errno === -4075) {
      return res.status(400).json({
        success: false,
        message: "Ya se tiene un directorio con ese nombre",
      });
    }
    return next(e);
  }

  res.json({ success: true, message: "Directorio creado" });
};

const moveFileDir = async (req, res, next) => {
  let { name } = req.body;
  let newPath = processPath(req.body.newPath);
  let oldPath = processPath(req.params.oldPath);

  newPath = path.join(newPath.absolutePath, name);
  oldPath = path.join(oldPath.absolutePath, name);
  try {
    await fs.promises.rename(oldPath, newPath);
  } catch (error) {
    return next(error);
  }
  res.json({ success: true, message: "Se movio con exito" });
};
const deleteFile = async (req, res, next) => {
  let { name } = req.body;
  let newPath = processPath(`/papelera/${name}`);
  let oldPath = processPath(req.params.oldPath);

  oldPath = path.join(oldPath.absolutePath, name);
  try {
    await fs.promises.rename(oldPath, newPath.absolutePath);
  } catch (error) {
    return next(error);
  }
  res.json({ success: true, message: "Se elimino con exito" });
};

module.exports = {
  uploadFile,
  getContent,
  createDir,
  deleteFile,
  moveFileDir,
};
