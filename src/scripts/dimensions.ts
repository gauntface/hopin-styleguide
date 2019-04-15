import {VariableGroup, Variable} from './_variable-group';
import {createVariableTable} from './_create-table';

const DIMENS_SUFFIX = 'dimens.css';
const DIMENS_CONTAINER = '__hopin__js-dimensions';

class DimensTable extends VariableGroup {
    constructor() {
        super(DIMENS_CONTAINER, DIMENS_SUFFIX);
    }

    renderData(variables: Variable[]): HTMLElement[] {
        return [createVariableTable(variables)];
    }
}

window.addEventListener('load', function() {
    new DimensTable().render();
});