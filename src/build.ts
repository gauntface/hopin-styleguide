import * as fs from 'fs-extra';
import * as path from 'path';
import * as json5 from 'json5';
import {buildSite, Config} from '@hopin/static-site';
import {logger} from './utils/logger'
import {prettyPath} from './utils/prettypath';

const THEME_FILE = 'theme.json5';

export async function build(dir: string) {
    logger.log(`Building styleguide for theme in: ${prettyPath(dir)}`);

    const theme = await getThemeFile(dir);
    
    const elements = await getElements(dir, theme.elements);

    // TODO: Generate list of assets

    await buildSite(path.join(__dirname, '..', 'template'), {
        outputPath: "../generated-styleguide",
        navigationFile: "./content/navigation.json",
        themePath: dir,
    } as Config);
}

async function getThemeFile(dir: string): Promise<Theme|null> {
    const themeFile = path.join(dir, THEME_FILE);
    try {
        const s = await fs.stat(themeFile);
        if (!s) {
            throw new Error(`Unable to stat the theme file.s`)
        }
    } catch (e) {
        logger.error(`Unable to find the theme ${THEME_FILE}`, e);
        return null;
    }
    
    try {
        const themeBuffer = await fs.readFile(themeFile);
        const theme = json5.parse(themeBuffer.toString()) as Theme;
        return theme;
    } catch (err) {
        logger.error(`Unable to read and parse the theme:`, err);
    }
    
    return null;
}

async function getElements(dir: string, elementsFile: string): Promise<Array<HTMLElement|null>> {
    let elementsPath = elementsFile;
    if (!path.isAbsolute(elementsPath)) {
        elementsPath = path.join(dir, elementsPath);
    }

    try {
        const elementsBuffer = await fs.readFile(elementsPath);
        return json5.parse(elementsBuffer.toString()) as Array<HTMLElement>;
    } catch (e) {
        logger.error(`Unable to read elements path: ${elementsPath}`, e);
    }
    return null;
}

interface Theme {
    elements: string
}

interface HTMLElement {
    tag: string
    styles: StyleGroup
    scripts: ScriptGroup
}

interface StyleGroup {
    inline: string[];
    sync: string[];
    async: string[];
}

interface ScriptGroup {
    inline: string[];
    sync: string[];
    async: string[];
}
