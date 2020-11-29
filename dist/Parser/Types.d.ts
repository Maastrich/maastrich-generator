import TypesList from './TypesList';
/**
 *
 *
 * @class Parser
 */
declare class Type {
    private typesList;
    private filePath;
    private route;
    private imports;
    private types;
    private exports;
    private oldContent;
    private newContent;
    /**
     * Creates an instance of Parser.
     * @param {Method} method
     * @memberof Parser
     */
    constructor(typesList: TypesList[], filePath: string, route: string);
    private parseImports;
    private createType;
    private parseTypes;
    private parseExport;
    private stringify;
    getFileInfo(): {
        old: string;
        new: string;
        path: string;
    };
}
export { Type };
export default Type;
