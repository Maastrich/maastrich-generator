/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import { terminal, Terminal } from 'terminal-kit';
import { Config, MethodInfo } from '../Types';
import Types from './Types';
import { HandlerParser } from './Handlers';
import TypesList from './TypesList';
import FileSaver from '../FileSaver';

class Parser {
  private path: string = './src/Handlers';

  private fileSaver: FileSaver = new FileSaver();

  private handlers: HandlerParser[] = [];

  private types: Types[] = [];

  private progress: number = 0;

  private progressBar: Terminal.ProgressBarController;

  constructor(private config: Config) {
    this.config.forEach((route) => {
      if (!fs.existsSync(this.path + route.path)) { fs.mkdirSync(this.path + route.path); }
    });
    this.progressBar = terminal.progressBar({
      width: 150,
      title: 'Generating Handlers and Types',
      eta: true,
      percent: true,
    });
  }

  private initSaver() {
    this.types.forEach((type, index) => {
      setTimeout(() => {
        this.fileSaver.addFile(type.getFileInfo());
        this.progress = 0.5 + +((index / (this.types.length)) / 4).toFixed(20);
        this.updateProgressBar();
      }, 100 * index);
    });
    setTimeout(() => {
      this.handlers.forEach((handler, index) => {
        setTimeout(() => {
          this.fileSaver.addFile(handler.getFileInfo());
          this.progress = 0.75 + +((index / (this.handlers.length)) / 4).toFixed(20);
          this.updateProgressBar();
        }, 100 * index);
        setTimeout(() => {
          this.progress = 1;
          this.updateProgressBar();
        }, 100 * this.handlers.length);
      });
    }, 100 * this.types.length);
  }

  private updateProgressBar() {
    this.progressBar.update(this.progress);
    if (this.progress >= 1) { setTimeout(() => { terminal('\n'); this.fileSaver.willCheckChanges(); }, 1000); }
  }

  public parseTypes() {
    this.config.forEach((route, index) => {
      setTimeout(() => {
        const typesList: TypesList[] = [];
        const functionList: MethodInfo[] = [];
        route.methods.forEach((methodInfo) => {
          typesList.push(
            { method: methodInfo.method, query: methodInfo.querytype, body: methodInfo.bodytype },
          );
        });
        this.types.push(new Types(typesList, `${this.path + route.path}/types.ts`, route.route));
        this.handlers.push(new HandlerParser(route.methods, `${this.path + route.path}/index.ts`, route.route));
        this.progress = +((index / (this.config.length)) / 2).toFixed(20);
        this.updateProgressBar();
      }, 100 * index);
    });
    setTimeout(() => {
      this.initSaver();
    }, 100 * this.config.length);
  }
}

export { Parser };
