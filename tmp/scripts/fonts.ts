import {VariableGroup, Variable} from './_variable-group';
import {createVariableTable} from './_create-table';

const FONTS_SUFFIX = 'fonts.css';
const FONTS_CONTAINER = '__hopin__js-fonts';

class FontsTable extends VariableGroup {
    constructor() {
        super(FONTS_CONTAINER, FONTS_SUFFIX);
    }

    renderData(variables: Variable[]): HTMLElement[] {
        return [createVariableTable(variables)];
    }
}

window.addEventListener('load', function() {
    new FontsTable().render();
});