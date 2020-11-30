declare class Environement {
    private fileSaver;
    private databaseItems;
    private availableDatabases;
    private oldContent;
    private databases;
    private logger;
    private env;
    constructor();
    init(): void;
    private getSecret;
    private getLogFolder;
    private databaseType;
    private databaseName;
    private databaseUri;
    private addDatabase;
    private getDatabases;
}
export { Environement };
