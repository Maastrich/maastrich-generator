import { Config } from '../Types';
declare class Parser {
    private config;
    private path;
    private fileSaver;
    private handlers;
    private types;
    private progress;
    private progressBar;
    constructor(config: Config);
    private initSaver;
    private updateProgressBar;
    parseTypes(): void;
}
export { Parser };
