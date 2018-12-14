/// <reference types="node" />
export declare function copy(fromPath: string, toPath: string, opts: any, callback: Function): any;
export declare function copyFile(fromPath: string, toPath: string, opts: any, callback: Function): void;
export declare function copyDir(fromPath: string, toPath: string, opts: any, callback: Function): void;
export declare function mkdir(toPath: string, callback: (err: NodeJS.ErrnoException) => void): void;
