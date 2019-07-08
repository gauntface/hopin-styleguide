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
    const styleguide = await getStyleguide(dir,theme);
    const components = await getComponents(dir, theme);
    const layouts = await getLayouts(dir, theme);

    const tmpDir = path.join(__dirname, '..', 'tmp');
    try {
        await fs.remove(tmpDir);
    } catch(err) {
        // NOOP
        console.error(`Failed to delete the tmp directory: `, err);
    }
    await fs.mkdirp(tmpDir);
    await fs.copy(
        path.join(__dirname, '..', 'template'),
        tmpDir
    );

    for (const l of layouts) {
        const lPath = path.join(tmpDir, "content", "layouts", `${l.id}.md`)
        await fs.writeFile(lPath, `---
layout: ${l.path}
title: Example Title
---
This is example content.
`);    
    }

    // TODO: Generate list of assets

    await buildSite(tmpDir, {
        outputPath: "../generated-styleguide",
        navigationFile: "./content/navigation.json",
        themePath: dir,
        styles: {
            inline: styleguide.styles,
        },
        scripts: {
            inline: styleguide.scripts,
        },
    } as Config, {
        components,
        layouts,
        styleguide,
    });
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

async function getStyleguide(dir: string, theme: Theme): Promise<StyleguideConfig> {
    let styleguidePath = theme.styleguide;
    if (!path.isAbsolute(styleguidePath)) {
        styleguidePath = path.join(dir, styleguidePath);
    }

    try {
        const styleguideBuffer = await fs.readFile(styleguidePath);
        const styleguideConfig = json5.parse(styleguideBuffer.toString()) as StyleguideConfig;
        const styleguideDir = path.dirname(styleguidePath);
        
        const urlKeys = ['colors', 'dimensions', 'fonts'];
        for (const k of urlKeys) {
            if (!styleguideConfig[k]) {
                continue;
            }
            for(let i = 0; i < styleguideConfig[k].length; i++) {
                const s = styleguideConfig[k][i];
                if (!path.isAbsolute(s)) {
                    styleguideConfig[k][i] = path.join('/', theme.assets.outputdir, s);
                }
            }
        }

        const keys = ['styles', 'scripts'];
        for (const k of keys) {
            if (!styleguideConfig[k]) {
                continue;
            }
            for(let i = 0; i < styleguideConfig[k].length; i++) {
                const s = styleguideConfig[k][i];
                if (!path.isAbsolute(s)) {
                    styleguideConfig[k][i] = path.join(styleguideDir, s);
                }
            }
        }
        return styleguideConfig;
    } catch (e) {
        logger.error(`Unable to read styleguide path: ${styleguidePath}`, e);
    }
    return null;
}

async function getComponents(dir: string, theme: Theme): Promise<Array<ComponentConfig>> {
    let componentsPath = theme.components;
    if (!path.isAbsolute(componentsPath)) {
        componentsPath = path.join(dir, componentsPath);
    }

    try {
        const componentsBuffer = await fs.readFile(componentsPath);
        const componentsConfig = json5.parse(componentsBuffer.toString()) as Array<ComponentConfig>;
        const parsedComponents: Array<ComponentConfig> = [];
        for (let i = 0; i < componentsConfig.length; i++) {
            const c = componentsConfig[i];
            c.path = path.join(path.dirname(componentsPath), c.path);
            parsedComponents.push(c);
        }
        return parsedComponents;
    } catch (e) {
        logger.error(`Unable to read component path: ${componentsPath}`, e);
    }
    return null;
}

async function getLayouts(dir: string, theme: Theme): Promise<Array<LayoutConfig>> {
    let layoutsPath = theme.layouts;
    if (!layoutsPath) {
        return [];
    }
    if (!path.isAbsolute(layoutsPath)) {
        layoutsPath = path.join(dir, layoutsPath);
    }

    try {
        const layoutsBuffer = await fs.readFile(layoutsPath);
        const layoutsConfig = json5.parse(layoutsBuffer.toString()) as Array<LayoutConfig>;
        const parsedLayouts: Array<LayoutConfig> = [];
        for (let i = 0; i < layoutsConfig.length; i++) {
            const c = layoutsConfig[i];
            c.path = path.join(path.dirname(layoutsPath), c.path);
            parsedLayouts.push(c);
        }
        return parsedLayouts;
    } catch (e) {
        logger.error(`Unable to read layout path: ${layoutsPath}`, e);
    }
    return null;
}

interface Theme {
    elements: string
    styleguide: string
    components: string
    layouts: string
    assets: Assets
}

interface ComponentConfig {
    name: string
    path: string
}

interface LayoutConfig {
    name: string
    id: string
    path: string
}

interface Assets {
    dir: string
    outputdir: string
}

interface HTMLElement {
    tag: string
    styles: StyleGroup
    scripts: ScriptGroup
}

interface StyleguideConfig {
    styles: string[];
    scripts: string[];
    [key: string]: string[];
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
