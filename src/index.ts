import ArgParsing from 'minimist';
import { Logger } from 'maastrich-logger';
import { normalize } from 'path';
import { Parser } from './Parser';
import { Environement } from './Env';

async function Generation() {
  const args = ArgParsing(process.argv);
  if (args.e || args.env) {
    const env = new Environement();
    env.init();
  } else if (args.c || args.config) {
    const path = args.c || args.config;
    try {
      const config = await import(`${process.env.PWD}/${path}`);
      try {
        const parser = new Parser(config.default);
        parser.parseTypes();
      } catch (e) {
        new Logger().error('Parsing', `${e}`);
      }
    } catch (e) {
      new Logger().error('Configuration file', (path === true) ? 'Argument path must not be empty' : `Unabled to load configuration file at ./${normalize(path)}: make sure the file exists and have the correct format`, true);
    }
  } else if (args.h || args.help) {
    new Logger().info(['-c, --config <path>\t\tConfigurate Types and Handler from config file at <path>', '-e, --env\t\t\tSetup project environement', '-h, --help\t\t\tDisplay this help message']);
    process.exit(0);
  } else { new Logger().error('You need at least one of these argument', ['-c, --config <path>', '-e, --env', '-h, --help'], true); }
}

export { Generation };

export * from './Types';
