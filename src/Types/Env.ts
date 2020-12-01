// eslint-disable-next-line max-classes-per-file
class DatabaseInfos {
  constructor(
    public type: string,
    public name: string,
    public uri: string,
  ) { }
}

class Env {
  constructor(
    public AuthSecret: string = '',
    public logFolder: string = './log',
    public databases: DatabaseInfos[] = [],
  ) { }

  public stringify() {
    let str: string = '';
    str += 'import { Environement } from \'maastrich-generator\';\n\n';
    str += 'const env: Environement = new Environement(\n';
    str += `\t\t'${this.AuthSecret}', '${this.logFolder}',\n`;
    str += `\t\t${JSON.stringify(this.databases)}\n\t)\n\n`;
    str += 'export { env };';
    return str;
  }
}

export { Env as Environement, DatabaseInfos };
