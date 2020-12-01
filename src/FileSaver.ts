import FileSystem from 'fs';
import Highlight from 'cli-highlight';
import { terminal } from 'terminal-kit';
import { Logger } from 'maastrich-logger';

const GitDiff = require('git-diff');

interface File {
  path: string,
  old: string,
  new: string,
}

interface TermMenuResponse {
  selectedText: string
}

class FileSaver {
  private files: File[] = [];

  private running: boolean = false;

  private logger : Logger;

  private acceptedFiles: File[] = [];

  private willCheckChangesItems: string[] = ['Review changes', 'Accept all changes', 'Quit generator without saving'];

  private checkChangesItems: string[] = ['Refuse changes', 'Accept changes', 'Quit generator without saving'];

  public addFile(file: File) {
    this.files.push(file);
  }

  private acceptAll() {
    this.acceptedFiles = this.files;
    this.writeFiles();
  }

  constructor(logFile: string = './log') {
    this.logger = new Logger(logFile);
  }

  private checkChanges(index: number = 0) {
    if (index < this.files.length) {
      const file: File = this.files[index];
      terminal.cyan('Check changes for: ');
      terminal.magenta(`${file.path}\n\n`);
      const diff = GitDiff(file.old, file.new);
      terminal(Highlight(diff || 'No changes founded'));
      terminal.cyan('\nDo you accept those changes ?\n');
      terminal.singleColumnMenu(
        this.checkChangesItems, (error?: Error, response?: TermMenuResponse) => {
          if (response) {
            switch (response.selectedText) {
              case 'Refuse changes': this.checkChanges(index + 1); break;
              case 'Accept changes': this.acceptedFiles.push(file); this.checkChanges(index + 1); break;
              default: this.logger.info('User choose to exit, no changes written :('); terminal.processExit(1);
            }
          }
        },
      );
    } else { this.writeFiles(); }
  }

  public willCheckChanges() {
    if (!this.running) {
      this.running = true;
      terminal.cyan('File generation is done, some eslint rules are not respected yet but will be automaticly patches in a second ;)\n');
      terminal.cyan('Please tell me if you want to review changes :D\n');
      terminal.singleColumnMenu(
        this.willCheckChangesItems, (error?: Error, response?: TermMenuResponse) => {
          if (response) {
            switch (response.selectedText) {
              case 'Review changes': this.checkChanges(); return;
              case 'Accept all changes': this.acceptAll(); return;
              default: this.logger.info('User choose to exit, no changes written :('); terminal.processExit(1);
            }
          }
        },
      );
    }
  }

  private writeFiles() {
    this.acceptedFiles.forEach((file: File) => {
      FileSystem.writeFile(file.path,
        file.new,
        (error) => {
          if (error) { this.logger.error('FileSaver', `Unabled to write new content in ${file.path}`); }
        });
    });
    terminal.processExit(0);
  }
}

export default FileSaver;
