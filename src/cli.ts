#!/usr/bin/env node

import * as meow from 'meow';
import {build} from './build';
import {logger} from './utils/logger';

const cli = meow(`
	Usage
      $ hopin-styleguide <task> <options>
    
    Tasks
      serve
      test

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
        case 'build':
            let dir = cli.flags.dir;
            if (!cli.flags.dir) {
                dir = process.cwd();
            }
            await build(dir);
            break;
        case 'serve':
            break;
        case 'test':
            break;
        default:
            logger.error(`Unknown task: '${cli.input[0]}'`);
            cli.showHelp();
    }
}

run();