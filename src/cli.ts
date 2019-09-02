#!/usr/bin/env node

import * as meow from 'meow';
import * as fs from 'fs';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import {build} from './build';
import {logger} from './utils/logger';

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
    
    switch(cli.input[0]) {
        case 'build': {
            let dir = cli.flags.dir;
            if (!cli.flags.dir) {
                dir = process.cwd();
            }
            await build(dir);
            break;
        }
        case 'serve': {
            let dir = cli.flags.dir;
            if (!cli.flags.dir) {
                dir = process.cwd();
            }

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

            console.log(`The server is running @ http://localhost:${port}`);

            let buildChain: Promise<String|void> = Promise.resolve();
            const onChange = () => {
                console.log('Rebuilding the styleguide...');
                buildChain = buildChain
                    .then(() => build(dir))
                    .catch(() => {
                        // Retry after 3s in case the files have
                        // stabilized.
                        setTimeout(onChange, 3000)
                    });
            }
            fs.watch(dir, {
                recursive: true,
            }, () => {
                console.log('TODO: Rebuild the styleguide');
                onChange();
            })
            
            // TODO: Start server in directory
            break;
        }
        default:
            logger.error(`Unknown task: '${cli.input[0]}'`);
            cli.showHelp();
    }
}

run();