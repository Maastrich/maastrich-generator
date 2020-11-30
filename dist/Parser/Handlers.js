"use strict";
/* eslint-disable max-len */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerParser = void 0;
var fs_1 = __importDefault(require("fs"));
var Types_1 = require("../Types");
function getContent(method) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    switch (method.method) {
        case Types_1.Method.Get: {
            return "response.status(200).json(await (await database('" + ((_a = method.database) === null || _a === void 0 ? void 0 : _a.name) + "').get('" + ((_b = method.database) === null || _b === void 0 ? void 0 : _b.collection) + "', query)).toArray());";
        }
        case Types_1.Method.Post: {
            return "response.status(200).json(await (await database('" + ((_c = method.database) === null || _c === void 0 ? void 0 : _c.name) + "').post('" + ((_d = method.database) === null || _d === void 0 ? void 0 : _d.collection) + "', body)).toArray());";
        }
        case Types_1.Method.Put: {
            return "response.status(200).json(await (await database('" + ((_e = method.database) === null || _e === void 0 ? void 0 : _e.name) + "').get('" + ((_f = method.database) === null || _f === void 0 ? void 0 : _f.collection) + "', body, query)).toArray());";
        }
        case Types_1.Method.Delete: {
            return "response.status(200).json(await (await database('" + ((_g = method.database) === null || _g === void 0 ? void 0 : _g.name) + "').get('" + ((_h = method.database) === null || _h === void 0 ? void 0 : _h.collection) + "', query)).toArray());";
        }
        default: return '';
    }
}
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
        var _this = this;
        this.imports.push("/* Handlers for route " + this.route + " */");
        this.methodList.forEach(function (method) {
            if (method.database) {
                _this.imports.push('import { database } from \'maastrich-database\'');
            }
        });
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
        functionString += "async function " + method.method + "(response: Response, query: Types." + method.method + "Query, body: Types." + method.method + "Body) {\n";
        functionString += "\t" + (method.database ? getContent(method) : 'response.status(200).json({ query, body });') + "\n";
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
            _this.exports.push("export { " + method.method + " };");
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