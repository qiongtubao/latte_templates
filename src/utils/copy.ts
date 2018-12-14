import * as Fs from 'fs'
import { dirname } from 'path'
import * as latte_lib from 'latte_lib'
export function copy(fromPath: string, toPath: string, opts: any, callback: Function) {
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
    } else if (stat.isDirectory()) {
        copyDir(fromPath, toPath, opts, callback);
    } else {
        callback();
    }
}

export function copyFile(fromPath: string, toPath: string, opts: any, callback: Function) {
    try {
        let from = Fs.createReadStream(fromPath)
        mkdir(dirname(toPath), function (error) {
            var to = Fs.createWriteStream(toPath);
            from.pipe(to);
            callback(null);
        });
    } catch (e) {
        console.log(e)
        callback(e);
    }
}
export function copyDir(fromPath: string, toPath: string, opts: any, callback: Function) {
    mkdir(toPath, () => {
        let files = Fs.readdirSync(fromPath);
        let all = files.map(function (file) {
            return function (cb) {
                copy(fromPath + '/' + file, toPath + '/' + file, opts, cb);
            }
        });
        latte_lib.async.parallel(all, callback);
    });
}
export function mkdir(toPath: string, callback: (err: NodeJS.ErrnoException) => void) {
    Fs.exists(toPath, function (exists) {
        if (exists) {
            callback(null);
        } else {
            mkdir(dirname(toPath), (err) => {
                if (err) { return callback(err); }
                Fs.mkdir(toPath, 0o777, callback);
            });
        }
    });
}
