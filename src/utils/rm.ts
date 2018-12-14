import * as Fs from 'fs'
let deleteFolderRecursive = (path) => {
    if (Fs.existsSync(path)) {
      Fs.readdirSync(path).forEach(function (file) {
        var curPath = path + "/" + file;
        if (Fs.statSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          Fs.unlinkSync(curPath);
        }
      });
      Fs.rmdirSync(path);
    }
  };
export let rm = (path: string, callback: (error) => void) => {
    if (!Fs.existsSync(path)) {
      return callback(undefined);
    }
    let stat = Fs.statSync(path);
    if (stat.isFile()) {
      Fs.unlink(path, callback);
    } else {
      try {
        deleteFolderRecursive(path);
      } catch (err) {
        return callback(err);
      }
      callback(undefined);
    }
  }