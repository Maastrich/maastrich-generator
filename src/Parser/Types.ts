/* eslint-disable max-len */
import fs from 'fs';
import { Prototype } from '../Types';
import TypesList from './TypesList';

/**
 * @param  {string} type
 */
function getTypeValidator(type: string) {
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
class Type {
  private imports: string[] = [];

  private types: string[] = [];

  private exports: string[] = [];

  private oldContent: string = '';

  private newContent: string = '';

  /**
   * Creates an instance of Parser.
   * @param {Method} method
   * @memberof Parser
   */
  constructor(private typesList: TypesList[], private filePath: string, private route: string) {
    fs.readFile(this.filePath, (err, data) => {
      if (!err) this.oldContent = data.toString().length ? data.toString() : '';
    });
    this.parseImports();
    this.parseTypes();
    this.parseExport();
  }

  private parseImports() {
    let validatorImport: boolean = false;
    this.imports.push('/* eslint-disable max-classes-per-file */');
    this.imports.push(`/* Types for route ${this.route} */`);
    this.typesList.forEach((type) => {
      if (type.query.length || type.body.length) { validatorImport = true; }
    });
    if (validatorImport) {
      this.imports.push('import * as Validator from \'class-validator\';');
      this.imports.push('import * as Transformer from \'class-transformer\';');
    }
    this.imports.push('import { Provider } from \'../Provider\';');
  }

  private createType(prototype: Prototype[], method: string, dataType: string) {
    let type : string = '';
    type += `class ${method}${dataType} extends Provider {\n`;
    prototype.forEach((atribute, index) => {
      type += `\t${getTypeValidator(atribute.type)}`;
      type += atribute.required ? '' : '\t@Validator.IsOptional()\n';
      type += atribute.defaultValue
        ? `\t@Transformer.Transform((value: ${atribute.type}) => value || ${atribute.defaultValue})\n`
        : '';
      type += '\t@Transformer.Expose()\n';
      type += `\t${atribute.key + (atribute.required ? '?' : '!')}: ${atribute.type};\n${(index === prototype.length - 1) ? '' : '\n'}`;
    });
    type += '}';
   this.types.push(type);
  }

  private parseTypes() {
    this.typesList.forEach((type) => {
      this.createType(type.query, type.method, 'Query');
      this.createType(type.body, type.method, 'Body');
    });
  }

  private parseExport() {
    this.typesList.forEach((type) => {
      this.exports.push(`export { ${type.method}Query, ${type.method}Body };`);
    });
  }

  private stringify() {
    this.imports.forEach((importString) => {
      this.newContent += `${importString}\n`;
    });
    this.newContent += '\n';
    this.types.forEach((type) => {
      this.newContent += `${type}\n\n`;
    });
    this.exports.forEach((exportString) => {
      this.newContent += `${exportString}\n`;
    });
  }

  public getFileInfo() {
    this.stringify();
    return {
      old: this.oldContent,
      new: this.newContent,
      path: this.filePath,
    };
  }
}

export { Type };
export default Type;
