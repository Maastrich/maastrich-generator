"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cli_highlight_1 = __importDefault(require("cli-highlight"));
var terminal_kit_1 = require("terminal-kit");
var logger_1 = require("logger");
var GitDiff = require('git-diff');
var FileSaver = /** @class */ (function () {
    function FileSaver(logFile) {
        if (logFile === void 0) { logFile = './log'; }
        this.files = [];
        this.running = false;
        this.acceptedFiles = [];
        this.willCheckChangesItems = ['Review changes', 'Accept all changes', 'Quit generator without saving'];
        this.checkChangesItems = ['Refuse changes', 'Accept changes', 'Quit generator without saving'];
        this.logger = new logger_1.Logger(logFile);
    }
    FileSaver.prototype.addFile = function (file) {
        this.files.push(file);
    };
    FileSaver.prototype.acceptAll = function () {
        this.acceptedFiles = this.files;
        this.writeFiles();
    };
    FileSaver.prototype.checkChanges = function (index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        if (index < this.files.length) {
            var file_1 = this.files[index];
            terminal_kit_1.terminal.cyan('Check changes for: ');
            terminal_kit_1.terminal.magenta(file_1.path + "\n\n");
            var diff = GitDiff(file_1.old, file_1.new);
            terminal_kit_1.terminal(cli_highlight_1.default(diff || 'No changes founded'));
            terminal_kit_1.terminal.cyan('\nDo you accept those changes ?\n');
            terminal_kit_1.terminal.singleColumnMenu(this.checkChangesItems, function (error, response) {
                if (response) {
                    switch (response.selectedText) {
                        case 'Refuse changes':
                            _this.checkChanges(index + 1);
                            break;
                        case 'Accept changes':
                            _this.acceptedFiles.push(file_1);
                            _this.checkChanges(index + 1);
                            break;
                        default:
                            _this.logger.info('User choose to exit, no changes written :(');
                            terminal_kit_1.terminal.processExit(1);
                    }
                }
            });
        }
        else {
            this.writeFiles();
        }
    };
    FileSaver.prototype.willCheckChanges = function () {
        var _this = this;
        if (!this.running) {
            this.running = true;
            terminal_kit_1.terminal.cyan('File generation is done, some eslint rules are not respected yet but will be automaticly patches in a second ;)\n');
            terminal_kit_1.terminal.cyan('Please tell me if you want to review changes :D\n');
            terminal_kit_1.terminal.singleColumnMenu(this.willCheckChangesItems, function (error, response) {
                if (response) {
                    switch (response.selectedText) {
                        case 'Review changes':
                            _this.checkChanges();
                            return;
                        case 'Accept all changes':
                            _this.acceptAll();
                            return;
                        default:
                            _this.logger.info('User choose to exit, no changes written :(');
                            terminal_kit_1.terminal.processExit(1);
                    }
                }
            });
        }
    };
    FileSaver.prototype.writeFiles = function () {
        var _this = this;
        this.acceptedFiles.forEach(function (file) {
            fs_1.default.writeFile(file.path, file.new, function (error) {
                if (error) {
                    _this.logger.error('FileSaver', "Unabled to write new content in " + file.path);
                }
            });
        });
        terminal_kit_1.terminal.processExit(0);
    };
    return FileSaver;
}());
exports.default = FileSaver;
//# sourceMappingURL=FileSaver.js.map