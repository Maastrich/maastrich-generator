/**
 *
 *
 * @class Parser
 */
declare class HandlerParser {
    private methodList;
    private filePath;
    private route;
    /**
     *
     *
     * @private
     * @type {string[]}
     * @memberof HandlerParser
     */
    private imports;
    /**
     *
     *
     * @private
     * @type {string[]}
     * @memberof HandlerParser
     */
    private functions;
    /**
     *
     *
     * @private
     * @type {string[]}
     * @memberof HandlerParser
     */
    private exports;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof HandlerParser
     */
    private oldContent;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof HandlerParser
     */
    private newContent;
    /**
     * Creates an instance of HandlerParser.
     * @param {string[]} methodList
     * @param {string} filePath
     * @param {string} route
     * @memberof HandlerParser
     */
    constructor(methodList: string[], filePath: string, route: string);
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    private parseImports;
    /**
     *
     *
     * @private
     * @param {string} method
     * @memberof HandlerParser
     */
    private createFunction;
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    private parseFunctions;
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    private parseExport;
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    private stringify;
    /**
     *
     *
     * @return {*}
     * @memberof HandlerParser
     */
    getFileInfo(): {
        old: string;
        new: string;
        path: string;
    };
}
export { HandlerParser };
export default HandlerParser;
