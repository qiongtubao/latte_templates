import { existsSync } from 'fs'
import { resolve } from 'path'
import { copy } from './utils/copy'
import { rm } from './utils/rm'
function find(name: string) {
    let path = resolve(__dirname, './../templates/', name)
    return existsSync(path) ? path : undefined;
}
export function init(templateName) {
    let path = find(templateName)
    if (path == undefined) {
        return console.log(`未找到${templateName}模版`)
    }
    let startTime = Date.now()
    copy(path, './', {}, function (err) {
        if(err) {
            return console.log(`创建失败`)
        }
        let time = Date.now() - startTime;
        console.log(`创建成功${templateName}: ${time} ms`);
    });
}
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
    let path = resolve(__dirname, './../templates/', templateName)
    copy('./', path, {}, function(err) {
        if(err) {
            return console.log(`添加模版${templateName}失败`)
        }
        console.log(`添加模版${templateName}成功`)
    });
}
export function add(templateName) {
    let path = find(templateName)
    if (path) {
        readSyncByRl(`模版${templateName}已存在是否删除 请输入y or n:`).then((res) => {
            console.log(res);
            if (res == 'y' || res == 'Y') {
                rm(path, function() {
                    addTemplate(templateName);
                });
            }
        });
    } else {
        addTemplate(templateName);
    }

}
export function remove(templateName) {
    let path = find(templateName)
    if(!path) {
        return console.log(`不存在${templateName}模版`)
    }
    rm(path, function(err) {
        if(err) {
            return console.log(`删除${templateName}模版失败`)
        }
        console.log(`删除${templateName}模版成功`);
    });
}