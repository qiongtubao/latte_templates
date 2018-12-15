"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const copy_1 = require("./utils/copy");
const rm_1 = require("./utils/rm");
function find(name) {
    let path = path_1.resolve(__dirname, './../templates/', name);
    return fs_1.existsSync(path) ? path : undefined;
}
function init(templateName) {
    let path = find(templateName);
    if (path == undefined) {
        return console.log(`未找到${templateName}模版`);
    }
    let startTime = Date.now();
    copy_1.copy(path, './', {}, function (err) {
        if (err) {
            return console.log(`创建失败`);
        }
        let time = Date.now() - startTime;
        console.log(`创建成功${templateName}: ${time} ms`);
    });
}
exports.init = init;
const readline = require('readline');
function readSyncByRl(tips) {
    tips = tips || '> ';
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
function addTemplate(templateName) {
    let path = path_1.resolve(__dirname, './../templates/', templateName);
    copy_1.copy('./', path, {
        ignore: [/node_modules/ig]
    }, function (err) {
        if (err) {
            return console.log(`添加模版${templateName}失败`);
        }
        console.log(`添加模版${templateName}成功`);
    });
}
function add(templateName) {
    let path = find(templateName);
    if (path) {
        readSyncByRl(`模版${templateName}已存在是否删除 请输入y or n:`).then((res) => {
            if (res == 'y' || res == 'Y') {
                rm_1.rm(path, function () {
                    addTemplate(templateName);
                });
            }
            else {
                console.log(`添加${templateName}模版终止`);
            }
        });
    }
    else {
        addTemplate(templateName);
    }
}
exports.add = add;
function remove(templateName) {
    let path = find(templateName);
    if (!path) {
        return console.log(`不存在${templateName}模版`);
    }
    rm_1.rm(path, function (err) {
        if (err) {
            return console.log(`删除${templateName}模版失败`);
        }
        console.log(`删除${templateName}模版成功`);
    });
}
exports.remove = remove;
