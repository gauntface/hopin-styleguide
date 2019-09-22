#!/usr/bin/env node

import * as meow from 'meow';
import * as fs from 'fs';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import * as path from 'path';
import {build} from './build';
import {logger} from './utils/logger';
import { pathExists } from 'fs-extra';

const cli = meow(`
	Usage
      $ hopin-styleguide <task> <options>
    
    Tasks
      build
      serve

    Options
      --dir The path to the theme
`, {
	flags: {
		dir: {
			type: 'string'
		},
	}
});

async function run() {
    if (cli.input.length === 0) {
        logger.error(`No task provided.`);
        cli.showHelp();
        return;
    }
    
    let dir = cli.flags.dir;
    if (!cli.flags.dir) {
        dir = process.cwd();
    }
    if (!path.isAbsolute(dir)) {
      dir = path.resolve(dir)
    }
    
    switch(cli.input[0]) {
        case 'build': {
            await build(dir);
            break;
        }
        case 'serve': {
            const outputPath = await build(dir);
            
            const PORT = 9000;
            const app = express();
            app.use(
              express.static(outputPath),
              serveIndex(outputPath, {'icons': true})
            );
            
            const port = await new Promise((resolve, reject) => {
                app.listen(PORT, (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(PORT);
                  }
                });
            });

            logger.log(`The server is running @ http://localhost:${port}`);

            let buildChain: Promise<String|void> = Promise.resolve();
            const onChange = () => {
                buildChain = buildChain
                    .then(() => {
                      logger.log('Rebuilding the styleguide...');
                      return build(dir);
                    })
                    .catch(() => {
                        // Retry after 3s in case the files have
                        // stabilized.
                        return new Promise((resolve) => {
                          setTimeout(resolve, 3000);
                        })
                        .then(onChange);
                    });
            }
            fs.watch(dir, {
                recursive: true,
            }, () => {
                onChange();
            });
            break;
        }
        default:
            logger.error(`Unknown task: '${cli.input[0]}'`);
            cli.showHelp();
    }
}

run();