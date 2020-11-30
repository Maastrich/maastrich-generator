"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseInfos = exports.Environement = void 0;
// eslint-disable-next-line max-classes-per-file
var DatabaseInfos = /** @class */ (function () {
    function DatabaseInfos(type, name, uri) {
        this.type = type;
        this.name = name;
        this.uri = uri;
    }
    return DatabaseInfos;
}());
exports.DatabaseInfos = DatabaseInfos;
var Env = /** @class */ (function () {
    function Env(AuthSecret, logFolder, databases) {
        if (AuthSecret === void 0) { AuthSecret = ''; }
        if (logFolder === void 0) { logFolder = './log'; }
        if (databases === void 0) { databases = []; }
        this.AuthSecret = AuthSecret;
        this.logFolder = logFolder;
        this.databases = databases;
    }
    Env.prototype.stringify = function () {
        var str = '';
        str += 'import { Environement } from \'maastrich-generator\';\n\n';
        str += 'const env: Environement = new Environement(\n';
        str += "\t\t'" + this.AuthSecret + "', '" + this.logFolder + "',\n";
        str += "\t\t" + JSON.stringify(this.databases) + "\n\t)\n\n";
        str += 'export { env };';
        return str;
    };
    return Env;
}());
exports.Environement = Env;
//# sourceMappingURL=Env.js.map