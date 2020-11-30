declare class DatabaseInfos {
    type: string;
    name: string;
    uri: string;
    constructor(type: string, name: string, uri: string);
}
declare class Env {
    AuthSecret: string;
    logFolder: string;
    databases: DatabaseInfos[];
    constructor(AuthSecret?: string, logFolder?: string, databases?: DatabaseInfos[]);
    stringify(): string;
}
export { Env, DatabaseInfos };
