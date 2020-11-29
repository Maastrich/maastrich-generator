"use strict";
/* eslint-disable max-len */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerParser = void 0;
var fs_1 = __importDefault(require("fs"));
/**
 *
 *
 * @class Parser
 */
var HandlerParser = /** @class */ (function () {
    /**
     * Creates an instance of HandlerParser.
     * @param {string[]} methodList
     * @param {string} filePath
     * @param {string} route
     * @memberof HandlerParser
     */
    function HandlerParser(methodList, filePath, route) {
        var _this = this;
        this.methodList = methodList;
        this.filePath = filePath;
        this.route = route;
        /**
         *
         *
         * @private
         * @type {string[]}
         * @memberof HandlerParser
         */
        this.imports = [];
        /**
         *
         *
         * @private
         * @type {string[]}
         * @memberof HandlerParser
         */
        this.functions = [];
        /**
         *
         *
         * @private
         * @type {string[]}
         * @memberof HandlerParser
         */
        this.exports = [];
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof HandlerParser
         */
        this.oldContent = '';
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof HandlerParser
         */
        this.newContent = '';
        fs_1.default.readFile(this.filePath, function (err, data) {
            if (!err)
                _this.oldContent = data.toString().length ? data.toString() : '';
        });
        this.parseImports();
        this.parseFunctions();
        this.parseExport();
    }
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    HandlerParser.prototype.parseImports = function () {
        this.imports.push("/* Handlers for route " + this.route + " */");
        this.imports.push('import { Response } from \'express\';');
        this.imports.push('import * as Types from \'./types\';');
    };
    /**
     *
     *
     * @private
     * @param {string} method
     * @memberof HandlerParser
     */
    HandlerParser.prototype.createFunction = function (method) {
        var functionString = '';
        functionString += "function " + method + "(response: Response, query: Types." + method + "Query, body: Types." + method + "Body) {\n";
        functionString += '\tresponse.status(200).json({ query, body });\n';
        functionString += '}';
        this.functions.push(functionString);
    };
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    HandlerParser.prototype.parseFunctions = function () {
        var _this = this;
        this.methodList.forEach(function (method) {
            _this.createFunction(method);
        });
    };
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    HandlerParser.prototype.parseExport = function () {
        var _this = this;
        this.methodList.forEach(function (method) {
            _this.exports.push("export { " + method + " };");
        });
    };
    /**
     *
     *
     * @private
     * @memberof HandlerParser
     */
    HandlerParser.prototype.stringify = function () {
        var _this = this;
        this.imports.forEach(function (importString) {
            _this.newContent += importString + "\n";
        });
        this.newContent += '\n';
        this.functions.forEach(function (type) {
            _this.newContent += type + "\n\n";
        });
        this.exports.forEach(function (exportString) {
            _this.newContent += exportString + "\n";
        });
    };
    /**
     *
     *
     * @return {*}
     * @memberof HandlerParser
     */
    HandlerParser.prototype.getFileInfo = function () {
        this.stringify();
        return {
            old: this.oldContent,
            new: this.newContent,
            path: this.filePath,
        };
    };
    return HandlerParser;
}());
exports.HandlerParser = HandlerParser;
exports.default = HandlerParser;
//# sourceMappingURL=Handlers.js.map