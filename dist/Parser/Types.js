"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
/* eslint-disable max-len */
var fs_1 = __importDefault(require("fs"));
/**
 * @param  {string} type
 */
function getTypeValidator(type) {
    switch (type) {
        case 'number': return '@Validator.IsNumber()\n';
        case 'string': return '@Validator.IsString()\n';
        case 'object': return '@Validator.IsObject()\n';
        default: return '';
    }
}
/**
 *
 *
 * @class Parser
 */
var Type = /** @class */ (function () {
    /**
     * Creates an instance of Parser.
     * @param {Method} method
     * @memberof Parser
     */
    function Type(typesList, filePath, route) {
        var _this = this;
        this.typesList = typesList;
        this.filePath = filePath;
        this.route = route;
        this.imports = [];
        this.types = [];
        this.exports = [];
        this.oldContent = '';
        this.newContent = '';
        fs_1.default.readFile(this.filePath, function (err, data) {
            if (!err)
                _this.oldContent = data.toString().length ? data.toString() : '';
        });
        this.parseImports();
        this.parseTypes();
        this.parseExport();
    }
    Type.prototype.parseImports = function () {
        var validatorImport = false;
        this.imports.push('/* eslint-disable max-classes-per-file */');
        this.imports.push("/* Types for route " + this.route + " */");
        this.typesList.forEach(function (type) {
            if (type.query.length || type.body.length) {
                validatorImport = true;
            }
        });
        if (validatorImport) {
            this.imports.push('import * as Validator from \'class-validator\';');
            this.imports.push('import * as Transformer from \'class-transformer\';');
        }
        this.imports.push('import { Provider } from \'../Provider\';');
    };
    Type.prototype.createType = function (prototype, method, dataType) {
        var type = '';
        type += "class " + method + dataType + " extends Provider {\n";
        prototype.forEach(function (atribute, index) {
            type += "\t" + getTypeValidator(atribute.type);
            type += atribute.required ? '' : '\t@Validator.IsOptional()\n';
            type += atribute.defaultValue
                ? "\t@Transformer.Transform((value: " + atribute.type + ") => value || " + atribute.defaultValue + ")\n"
                : '';
            type += '\t@Transformer.Expose()\n';
            type += "\t" + (atribute.key + (atribute.required ? '?' : '!')) + ": " + atribute.type + ";\n" + ((index === prototype.length - 1) ? '' : '\n');
        });
        type += '}';
        this.types.push(type);
    };
    Type.prototype.parseTypes = function () {
        var _this = this;
        this.typesList.forEach(function (type) {
            _this.createType(type.query, type.method, 'Query');
            _this.createType(type.body, type.method, 'Body');
        });
    };
    Type.prototype.parseExport = function () {
        var _this = this;
        this.typesList.forEach(function (type) {
            _this.exports.push("export { " + type.method + "Query, " + type.method + "Body };");
        });
    };
    Type.prototype.stringify = function () {
        var _this = this;
        this.imports.forEach(function (importString) {
            _this.newContent += importString + "\n";
        });
        this.newContent += '\n';
        this.types.forEach(function (type) {
            _this.newContent += type + "\n\n";
        });
        this.exports.forEach(function (exportString) {
            _this.newContent += exportString + "\n";
        });
    };
    Type.prototype.getFileInfo = function () {
        this.stringify();
        return {
            old: this.oldContent,
            new: this.newContent,
            path: this.filePath,
        };
    };
    return Type;
}());
exports.Type = Type;
exports.default = Type;
//# sourceMappingURL=Types.js.map