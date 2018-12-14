"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const path_1 = require("path");
const latte_lib = require("latte_lib");
function copy(fromPath, toPath, opts, callback) {
    if (opts.ignore) {
        for (let i = 0, len = opts.ignore.length; i < len; i++) {
            if (opts.ignore[i].test(fromPath)) {
                return callback();
            }
        }
    }
    let stat = Fs.statSync(fromPath);
    if (stat.isFile()) {
        copyFile(fromPath, toPath, opts, callback);
    }
    else if (stat.isDirectory()) {
        copyDir(fromPath, toPath, opts, callback);
    }
    else {
        callback();
    }
}
exports.copy = copy;
function copyFile(fromPath, toPath, opts, callback) {
    try {
        let from = Fs.createReadStream(fromPath);
        mkdir(path_1.dirname(toPath), function (error) {
            var to = Fs.createWriteStream(toPath);
            from.pipe(to);
            callback(null);
        });
    }
    catch (e) {
        console.log(e);
        callback(e);
    }
}
exports.copyFile = copyFile;
function copyDir(fromPath, toPath, opts, callback) {
    mkdir(toPath, () => {
        let files = Fs.readdirSync(fromPath);
        let all = files.map(function (file) {
            return function (cb) {
                copy(fromPath + '/' + file, toPath + '/' + file, opts, cb);
            };
        });
        latte_lib.async.parallel(all, callback);
    });
}
exports.copyDir = copyDir;
function mkdir(toPath, callback) {
    Fs.exists(toPath, function (exists) {
        if (exists) {
            callback(null);
        }
        else {
            mkdir(path_1.dirname(toPath), (err) => {
                if (err) {
                    return callback(err);
                }
                Fs.mkdir(toPath, 0o777, callback);
            });
        }
    });
}
exports.mkdir = mkdir;
