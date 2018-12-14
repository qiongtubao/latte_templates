"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
let deleteFolderRecursive = (path) => {
    if (Fs.existsSync(path)) {
        Fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (Fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                Fs.unlinkSync(curPath);
            }
        });
        Fs.rmdirSync(path);
    }
};
exports.rm = (path, callback) => {
    if (!Fs.existsSync(path)) {
        return callback(undefined);
    }
    let stat = Fs.statSync(path);
    if (stat.isFile()) {
        Fs.unlink(path, callback);
    }
    else {
        try {
            deleteFolderRecursive(path);
        }
        catch (err) {
            return callback(err);
        }
        callback(undefined);
    }
};
