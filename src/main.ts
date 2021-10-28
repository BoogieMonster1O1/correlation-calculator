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
        .map((value: PartialEntry) => new Entry(value.x, value.y, value.dx, value.dy, value.dx * value.dx, value.dy * value.dy, value.dx * value.dy))
        .value()

    outTable.childNodes.forEach((node) => node.remove);

    console.log(out);
    console.log(means);
    console.log(data);
}
