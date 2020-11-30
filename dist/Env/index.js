"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environement = void 0;
var fs_1 = require("fs");
var maastrich_logger_1 = require("maastrich-logger");
var terminal_kit_1 = __importStar(require("terminal-kit"));
var FileSaver_1 = __importDefault(require("../FileSaver"));
var Types_1 = require("../Types");
var Environement = /** @class */ (function () {
    function Environement() {
        var _this = this;
        this.fileSaver = new FileSaver_1.default();
        this.databaseItems = ['New Database', 'It\'s ok, let\'s continue :)'];
        this.availableDatabases = ['Mongo', 'OwnDatabase'];
        this.oldContent = '';
        this.databases = [];
        this.logger = new maastrich_logger_1.Logger('./log');
        this.env = new Types_1.Environement();
        if (!fs_1.existsSync('.env')) {
            fs_1.mkdirSync('.env');
        }
        else {
            fs_1.readFile('.env/index.ts', function (err, data) {
                if (!err)
                    _this.oldContent = data.toString().length ? data.toString() : '';
            });
        }
        process.on('SIGINT', function () {
            terminal_kit_1.terminal.processExit(130);
        });
    }
    Environement.prototype.init = function () {
        this.getSecret();
    };
    Environement.prototype.getSecret = function () {
        var _this = this;
        terminal_kit_1.terminal('Please enter your JsonWebToken secret key: ');
        terminal_kit_1.terminal.inputField({}, function (error, input) {
            if (error) {
                throw error;
            }
            else if (input) {
                _this.env.AuthSecret = input;
            }
            _this.getLogFolder();
        });
    };
    Environement.prototype.getLogFolder = function () {
        var _this = this;
        var autoCompleter = function autoCompleter(inputString, callback) {
            fs_1.readdir('.', function (_error, files) {
                callback(undefined, terminal_kit_1.default.autoComplete(files, inputString, true));
            });
        };
        terminal_kit_1.terminal('\nPlease enter the relative path to the log files\' folder (default: \'./log\'): ');
        terminal_kit_1.terminal.inputField({ autoComplete: autoCompleter }, function (error, input) {
            if (error) {
                throw error;
            }
            else if (input) {
                _this.env.logFolder = input;
            }
            _this.getDatabases();
        });
    };
    Environement.prototype.databaseType = function () {
        var _this = this;
        terminal_kit_1.terminal('Database info:\n');
        terminal_kit_1.terminal('Please enter database type: ');
        var newInput = '';
        terminal_kit_1.terminal.singleColumnMenu(this.availableDatabases, function (error, response) {
            if (error) {
                throw error;
            }
            newInput = (response === null || response === void 0 ? void 0 : response.selectedText) || '';
            _this.databaseName(newInput);
        });
    };
    Environement.prototype.databaseName = function (type) {
        var _this = this;
        terminal_kit_1.terminal('\nPlease enter database name: ');
        terminal_kit_1.terminal.inputField({}, function (error, input) {
            var newInput = '';
            if (error) {
                throw error;
            }
            else if (input) {
                newInput = input;
            }
            _this.databaseUri(type, newInput);
        });
    };
    Environement.prototype.databaseUri = function (type, name) {
        var _this = this;
        terminal_kit_1.terminal('\nPlease enter database uri: ');
        terminal_kit_1.terminal.inputField({}, function (error, input) {
            var newInput = '';
            if (error) {
                throw error;
            }
            else if (input) {
                newInput = input;
            }
            _this.env.databases.push(new Types_1.DatabaseInfos(type, name, newInput));
            _this.getDatabases();
        });
    };
    Environement.prototype.addDatabase = function () {
        this.databaseType();
    };
    Environement.prototype.getDatabases = function () {
        var _this = this;
        terminal_kit_1.terminal.singleColumnMenu(this.databaseItems, function (error, response) {
            if (response) {
                switch (response.selectedText) {
                    case 'New Database':
                        _this.addDatabase();
                        return;
                    default: _this.fileSaver.addFile({ old: '', new: _this.env.stringify(), path: '.env/index.ts' });
                }
                _this.fileSaver.willCheckChanges();
            }
        });
    };
    return Environement;
}());
exports.Environement = Environement;
//# sourceMappingURL=index.js.map