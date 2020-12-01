/* eslint-disable max-len */

import fs from 'fs';
import { Method, MethodInfo } from '../Types';

function getContent(method: MethodInfo) {
  switch (method.method) {
    case Method.Get: {
      return `response.status(200).json(await (await database('${method.database?.name}').get('${method.database?.collection}', query)).toArray());`;
    }
    case Method.Post: {
      return `response.status(200).json(await (await database('${method.database?.name}').post('${method.database?.collection}', body)).toArray());`;
    }
    case Method.Put: {
      return `response.status(200).json(await (await database('${method.database?.name}').get('${method.database?.collection}', body, query)).toArray());`;
    }
    case Method.Delete: {
      return `response.status(200).json(await (await database('${method.database?.name}').get('${method.database?.collection}', query)).toArray());`;
    }
    default: return '';
  }
}

/**
 *
 *
 * @class Parser
 */
class HandlerParser {
  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof HandlerParser
   */
  private imports: string[] = [];

  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof HandlerParser
   */
  private functions: string[] = [];

  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof HandlerParser
   */
  private exports: string[] = [];

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof HandlerParser
   */
  private oldContent: string = '';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof HandlerParser
   */
  private newContent: string = '';

  /**
   * Creates an instance of HandlerParser.
   * @param {string[]} methodList
   * @param {string} filePath
   * @param {string} route
   * @memberof HandlerParser
   */
  constructor(private methodList: MethodInfo[], private filePath: string, private route: string) {
    fs.readFile(this.filePath, (err, data) => {
      if (!err) this.oldContent = data.toString().length ? data.toString() : '';
    });
    this.parseImports();
    this.parseFunctions();
    this.parseExport();
  }

  /**
   *
   *
   * @private
   * @memberof HandlerParser
   */
  private parseImports() {
    this.imports.push(`/* Handlers for route ${this.route} */`);
    this.methodList.forEach((method) => {
      if (method.database) {
        this.imports.push('import { database } from \'maastrich-database\'');
      }
    });
    this.imports.push('import { Response } from \'express\';');
    this.imports.push('import * as Types from \'./types\';');
  }

  /**
   *
   *
   * @private
   * @param {string} method
   * @memberof HandlerParser
   */
  private createFunction(method: MethodInfo) {
    let functionString = '';
    functionString += `async function ${method.method}(response: Response, query: Types.${method.method}Query, body: Types.${method.method}Body) {\n`;
    functionString += `\t${method.database ? getContent(method) : 'response.status(200).json({ query, body });'}\n`;
    functionString += '}';
    this.functions.push(functionString);
  }

  /**
   *
   *
   * @private
   * @memberof HandlerParser
   */
  private parseFunctions() {
    this.methodList.forEach((method) => {
      this.createFunction(method);
    });
  }

  /**
   *
   *
   * @private
   * @memberof HandlerParser
   */
  private parseExport() {
    this.methodList.forEach((method) => {
      this.exports.push(`export { ${method.method} };`);
    });
  }

  /**
   *
   *
   * @private
   * @memberof HandlerParser
   */
  private stringify() {
    this.imports.forEach((importString) => {
      this.newContent += `${importString}\n`;
    });
    this.newContent += '\n';
    this.functions.forEach((type) => {
      this.newContent += `${type}\n\n`;
    });
    this.exports.forEach((exportString) => {
      this.newContent += `${exportString}\n`;
    });
  }

  /**
   *
   *
   * @return {*}
   * @memberof HandlerParser
   */
  public getFileInfo() {
    this.stringify();
    return {
      old: this.oldContent,
      new: this.newContent,
      path: this.filePath,
    };
  }
}

export { HandlerParser };
export default HandlerParser;
