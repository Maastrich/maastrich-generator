import {
  existsSync, mkdirSync, readdir, readFile,
} from 'fs';
import { Logger } from 'maastrich-logger';
import termkit, { terminal } from 'terminal-kit';
import FileSaver from '../FileSaver';
import { Environement as Env, DatabaseInfos } from '../Types';

interface TermMenuResponse {
  selectedText: string
}

class Environement {
  private fileSaver: FileSaver = new FileSaver();

  private databaseItems: string[] = ['New Database', 'It\'s ok, let\'s continue :)'];

  private availableDatabases: string[] = ['Mongo', 'OwnDatabase'];

  private oldContent: string = '';

  private databases: any[] = [];

  private logger: Logger = new Logger('./log');

  private env: Env = new Env();

  constructor() {
    if (!existsSync('.env')) { mkdirSync('.env'); } else {
      readFile('.env/index.ts', (err, data) => {
        if (!err) this.oldContent = data.toString().length ? data.toString() : '';
      });
    }
    process.on('SIGINT', () => {
      terminal.processExit(130);
    });
  }

  public init() {
    this.getSecret();
  }

  private getSecret() {
    terminal('Please enter your JsonWebToken secret key: ');
    terminal.inputField({}, (error, input) => {
      if (error) { throw error; } else if (input) { this.env.AuthSecret = input; }
      this.getLogFolder();
    });
  }

  private getLogFolder() {
    const autoCompleter = function autoCompleter(inputString: string, callback: Function) {
      readdir('.', (_error, files) => {
        callback(undefined, termkit.autoComplete(files, inputString, true));
      });
    };
    terminal('\nPlease enter the relative path to the log files\' folder (default: \'./log\'): ');
    terminal.inputField({ autoComplete: autoCompleter }, (error, input) => {
      if (error) { throw error; } else if (input) { this.env.logFolder = input; }
      this.getDatabases();
    });
  }

  private databaseType() {
    terminal('Database info:\n');
    terminal('Please enter database type: ');
    let newInput = '';
    terminal.singleColumnMenu(
      this.availableDatabases, (error?: Error, response?: TermMenuResponse) => {
        if (error) { throw error; }
        newInput = response?.selectedText || '';
        this.databaseName(newInput);
      },
    );
  }

  private databaseName(type: string) {
    terminal('\nPlease enter database name: ');
    terminal.inputField({}, (error, input) => {
      let newInput = '';
      if (error) { throw error; } else if (input) { newInput = input; }
      this.databaseUri(type, newInput);
    });
  }

  private databaseUri(type: string, name: string) {
    terminal('\nPlease enter database uri: ');
    terminal.inputField({}, (error, input) => {
      let newInput = '';
      if (error) { throw error; } else if (input) { newInput = input; }
      this.env.databases.push(new DatabaseInfos(type, name, newInput));
      this.getDatabases();
    });
  }

  private addDatabase() {
    this.databaseType();
  }

  private getDatabases() {
    terminal.singleColumnMenu(
      this.databaseItems, (error?: Error, response?: TermMenuResponse) => {
        if (response) {
          switch (response.selectedText) {
            case 'New Database': this.addDatabase(); return;
            default: this.fileSaver.addFile({ old: '', new: this.env.stringify(), path: '.env/index.ts' });
          }
          this.fileSaver.willCheckChanges();
        }
      },
    );
  }
}

export { Environement };
