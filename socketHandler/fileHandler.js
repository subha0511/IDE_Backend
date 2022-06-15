const fs = require("fs/promises");

module.exports = (io, socket) => {
  //Save file to base path folder
  //Listener : file:create , file:save
  //Payload : {
  //  path: - file path from root / base path folder including extension
  //  body: - code/content of the file
  //}
  const saveFile = async (payload) => {
    const { path, body } = payload;
    const filePathName = process.env.BASEPATH + "/" + path;

    try {
      await fs.writeFile(filePathName, body);
      socket.emit("status", {
        status: "Success",
        msg: "File saved/created",
        path: filePathName,
      });
    } catch (err) {
      socket.emit("status", {
        status: "Failed",
        msg: "Failed to save/create file",
        error: err,
      });
    }
  };

  //delete file from base path folder
  //Listener : file:delete
  //Payload : {
  //  path: - file path from root / base path folder including extension
  //}
  const deleteFile = async (payload) => {
    const { path } = payload;
    const filePathName = process.env.BASEPATH + "/" + path;

    try {
      await fs.unlink(filePathName);
      socket.emit("status", {
        status: "Success",
        msg: "File deleted",
        path: filePathName,
      });
    } catch (err) {
      socket.emit("status", {
        status: "Failed",
        msg: "Failed to delete file",
        error: err,
      });
    }
  };

  //create folder from base path folder
  //Listener : folder:create
  //Payload : {
  //  path: - folder path from root / base path folder including extension
  //}
  const createFolder = async (payload) => {
    const { path } = payload;
    const folderPathName = process.env.BASEPATH + "/" + path;

    try {
      await fs.mkdir(folderPathName, { recursive: true });

      socket.emit("status", {
        status: "Success",
        msg: "Folder created",
        path: folderPathName,
      });
    } catch (err) {
      socket.emit("status", {
        status: "Failed",
        msg: "Failed to create folder",
        error: err,
      });
    }
  };

  //delete folder from base path folder
  //Listener : folder:delete
  //Payload : {
  //  path: - folder path from root / base path folder including extension
  //}
  const deleteFolder = async (payload) => {
    const { path } = payload;
    const folderPathName = process.env.BASEPATH + "/" + path;

    try {
      await fs.rm(folderPathName, { recursive: true });

      socket.emit("status", {
        status: "Success",
        msg: "Folder deleted",
        path: folderPathName,
      });
    } catch (err) {
      socket.emit("status", {
        status: "Failed",
        msg: "Failed to delete folder",
        error: err,
      });
    }
  };

  //rename file/folder from base path folder
  //Listener : folder:rename,file:rename
  //Payload : {
  //  prevPath: - previous file/folder path from root / base path folder including extension
  //  currPath: - updated(current) file/folder path from root / base path folder including extension
  //}
  const rename = async (payload) => {
    const { prevPath, currPath } = payload;
    const prevPathName = process.env.BASEPATH + "/" + prevPath;
    const currPathName = process.env.BASEPATH + "/" + currPath;

    try {
      await fs.rename(prevPathName, currPathName);

      socket.emit("status", {
        status: "Success",
        msg: "File/Folder renamed",
      });
    } catch (err) {
      socket.emit("status", {
        status: "Failed",
        msg: "Failed to rename file/folder",
        error: err,
      });
    }
  };

  socket.on("file:save", saveFile);
  socket.on("file:create", saveFile);
  socket.on("file:delete", deleteFile);
  socket.on("folder:create", createFolder);
  socket.on("folder:delete", deleteFolder);
  socket.on("file:rename", rename);
  socket.on("folder:rename", rename);
};
