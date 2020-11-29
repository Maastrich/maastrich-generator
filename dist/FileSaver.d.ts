interface File {
    path: string;
    old: string;
    new: string;
}
declare class FileSaver {
    private files;
    private running;
    private logger;
    private acceptedFiles;
    private willCheckChangesItems;
    private checkChangesItems;
    addFile(file: File): void;
    private acceptAll;
    constructor(logFile?: string);
    private checkChanges;
    willCheckChanges(): void;
    private writeFiles;
}
export default FileSaver;
