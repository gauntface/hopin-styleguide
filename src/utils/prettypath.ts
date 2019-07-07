import * as path from 'path';

export function prettyPath(filePath: string): string {
    const cwd = process.cwd();
    if (filePath.indexOf(cwd) === 0) {
        return path.relative(cwd, filePath);
    }
    return filePath;
}