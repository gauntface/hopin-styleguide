import {Variable} from './_variable-group';
import {copyToClipboard} from './_clipboard';

const VAR_TABLE_CLASS = '__hopin__c-variable-table';

export function createVariableTable(variables: Variable[]): HTMLElement {
    const columns = ["Variable Name", "Value", ""];
    const rows: Array<Array<string|HTMLElement>> = []
    for (const v of variables) {
        const copyText = document.createElement('div');
      copyText.textContent = 'Copy';
      copyText.addEventListener('click', (e) => {
        e.preventDefault();
        const success = copyToClipboard(v.variableName);
        if (success) {
          copyText.textContent = 'Copied';
          setTimeout(() => {
            copyText.textContent = 'Copy';
          }, 1000);
        }
      });
      rows.push([v.variableName, v.value, copyText]);
    }
    return createTable({
        columns,
        rows,
    });
}

export function createTable(data: VARIABLE_TABLE): HTMLElement {
    const table = document.createElement('table');
    table.classList.add(VAR_TABLE_CLASS);
    const tblHead = document.createElement('thead');
    const tblBody = document.createElement('tbody');
    table.appendChild(tblHead);
    table.appendChild(tblBody);

    const headRow = document.createElement('tr');
    for (const c of data.columns) {
        const heading = document.createElement('th');
        heading.textContent = c;
        headRow.appendChild(heading);
    }
    tblHead.appendChild(headRow);

    for (const r of data.rows) {
        const row = document.createElement('tr');
        for (const rd of r) {
            const col = document.createElement('td');
            if (typeof rd === 'string') {
                col.textContent = rd;
            } else {
                col.appendChild(rd);
            }
            row.appendChild(col);
        }
        tblBody.appendChild(row);
    }
    return table;
}

interface VARIABLE_TABLE {
    columns: string[];
    rows: Array<Array<string|HTMLElement>>;
}