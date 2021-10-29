import "./style.css"
import "tailwindcss/tailwind.css"
import * as _ from "lodash";

const textArea: HTMLTextAreaElement = document.querySelector<HTMLTextAreaElement>("#coords")!;
const outTable: HTMLTableElement = document.querySelector<HTMLTableElement>("#outTable")!;

class PartialEntry {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly dx: number,
        readonly dy: number
    ) {}

    complete(): Entry {
        return new Entry(
            this.x,
            this.y,
            this.dx,
            this.dy,
            this.dx * this.dx,
            this.dy * this.dy,
            this.dx * this.dy
        );
    }
}

class Entry {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly dx: number,
        readonly dy: number,
        readonly dx2: number,
        readonly dy2: number,
        readonly dxdy: number
    ) {}

    addRow(table: HTMLTableElement): void {
        const entryRow: HTMLTableRowElement = outTable.insertRow();
        entryRow.appendChild(createTableCell(this.x));
        entryRow.appendChild(createTableCell(this.y));
        entryRow.appendChild(createTableCell(this.dx));
        entryRow.appendChild(createTableCell(this.dy));
        entryRow.appendChild(createTableCell(this.dx2));
        entryRow.appendChild(createTableCell(this.dy2));
        entryRow.appendChild(createTableCell(this.dxdy));
    }
}

document.getElementById("calculate")!.onclick = function(){
    const lines: string[] = textArea.value.split("\n")
    const out = _.chain(lines)
        .map((value: string) => value.split(" "))
        .filter((value: string[]) => value.length == 2)
        .map((value: string[]) => [parseInt(value[0]), parseInt(value[1])])
        .filter((value: number[]) => !value.includes(NaN))
        .uniq()
        .value();
    const means: number[] = out.reduce((a: number[], b: number[]) => [a[0] + b[0], a[1] + b[1]])
                            .map(a => (a + 0.0) / out.length)
    const data: Entry[] = _.chain(out)
        .map((value: number[]) => new PartialEntry(value[0], value[1], value[0] - means[0], value[1] - means[1]))
        .map((value: PartialEntry) => value.complete())
        .value()

    removeAllChildren(outTable);
    const headingRow: HTMLTableRowElement = outTable.insertRow();
    headingRow.appendChild(createTableHeading("x"));
    headingRow.appendChild(createTableHeading("y"));
    headingRow.appendChild(createTableHeading("dx"));
    headingRow.appendChild(createTableHeading("dy"));
    headingRow.appendChild(createTableHeading("dx2"));
    headingRow.appendChild(createTableHeading("dy2"));
    headingRow.appendChild(createTableHeading("dxdy"));
    data.forEach((entry: Entry) => entry.addRow(outTable));

    console.log(out);
    console.log(means);
    console.log(data);
}

function removeAllChildren(element: HTMLElement) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function createTableHeading(value: string): HTMLTableCellElement {
    const element: HTMLTableCellElement = document.createElement('th');
    element.innerHTML = value;
    return element;
}

function createTableCell(value: number): HTMLTableCellElement {
    const element: HTMLTableCellElement = document.createElement('th');
    element.innerHTML = value.toString();
    return element;
}
