"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var fs_1 = __importDefault(require("fs"));
var terminal_kit_1 = require("terminal-kit");
var Types_1 = __importDefault(require("./Types"));
var Handlers_1 = require("./Handlers");
var FileSaver_1 = __importDefault(require("../FileSaver"));
var Parser = /** @class */ (function () {
    function Parser(config) {
        var _this = this;
        this.config = config;
        this.path = './src/Handlers';
        this.fileSaver = new FileSaver_1.default();
        this.handlers = [];
        this.types = [];
        this.progress = 0;
        this.config.forEach(function (route) {
            if (!fs_1.default.existsSync(_this.path + route.path)) {
                fs_1.default.mkdirSync(_this.path + route.path);
            }
        });
        this.progressBar = terminal_kit_1.terminal.progressBar({
            width: 150,
            title: 'Generating Handlers and Types',
            eta: true,
            percent: true,
        });
    }
    Parser.prototype.initSaver = function () {
        var _this = this;
        this.types.forEach(function (type, index) {
            setTimeout(function () {
                _this.fileSaver.addFile(type.getFileInfo());
                _this.progress = 0.5 + +((index / (_this.types.length)) / 4).toFixed(20);
                _this.updateProgressBar();
            }, 100 * index);
        });
        setTimeout(function () {
            _this.handlers.forEach(function (handler, index) {
                setTimeout(function () {
                    _this.fileSaver.addFile(handler.getFileInfo());
                    _this.progress = 0.75 + +((index / (_this.handlers.length)) / 4).toFixed(20);
                    _this.updateProgressBar();
                }, 100 * index);
                setTimeout(function () {
                    _this.progress = 1;
                    _this.updateProgressBar();
                }, 100 * _this.handlers.length);
            });
        }, 100 * this.types.length);
    };
    Parser.prototype.updateProgressBar = function () {
        var _this = this;
        this.progressBar.update(this.progress);
        if (this.progress >= 1) {
            setTimeout(function () { terminal_kit_1.terminal('\n'); _this.fileSaver.willCheckChanges(); }, 1000);
        }
    };
    Parser.prototype.parseTypes = function () {
        var _this = this;
        this.config.forEach(function (route, index) {
            setTimeout(function () {
                var typesList = [];
                var functionList = [];
                route.methods.forEach(function (methodInfo) {
                    typesList.push({ method: methodInfo.method, query: methodInfo.querytype, body: methodInfo.bodytype });
                });
                _this.types.push(new Types_1.default(typesList, _this.path + route.path + "/types.ts", route.route));
                _this.handlers.push(new Handlers_1.HandlerParser(route.methods, _this.path + route.path + "/index.ts", route.route));
                _this.progress = +((index / (_this.config.length)) / 2).toFixed(20);
                _this.updateProgressBar();
            }, 100 * index);
        });
        setTimeout(function () {
            _this.initSaver();
        }, 100 * this.config.length);
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=index.js.map