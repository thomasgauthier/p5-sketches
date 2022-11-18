import p5 from "p5"
import TextToSVG from 'text-to-svg/src/index';
const containerElement = document.getElementById('p5-container');


let poses = []

let textToSVG = undefined;


function fillPoses(str, offset = { x: 0, y: 0 }) {

    if (!textToSVG) {
        return;
    }

    const svg = textToSVG.getSVG(str);

    const parser = new DOMParser();

    const doc = parser.parseFromString(svg, "text/html");

    const path = doc.querySelector('path')

    const length = path.getTotalLength();

    const yOffset = parseFloat(doc.querySelector('svg').getAttribute('height'))

    const resolution = 5;


    for (let i = 0; i < Math.ceil(length / resolution); i++) {
        const { x, y } = path.getPointAtLength(i * resolution)

        poses.push({ x: x + offset.x, y: parseFloat(y) + yOffset + offset.y });
    }
}

TextToSVG.load('fonts/HyperFont.otf', (err, t) => {
    textToSVG = t;
});
/**
 * 
 * @param {p5} p 
 */
const sketch = (p) => {
    const RADIUS = 10;
    const HOVERITENSITY = 0.1;
    const dotSpeed = 1;

    let str = ""

    let numberOfBRs = 0;
    let lineLength = 0;

    const dotPositions = new Array()
    Object.defineProperty(dotPositions, 'last', {
        get: function () {
            return this.length ? this[this.length - 1] : undefined;
        }
    });

    p.setup = () => {
        p.createCanvas(800, 600);
        p.background(220);

        for (let i = 0; i < 1000; i++) {
            dotPositions.push({ x: Math.random() * p.width, y: Math.random() * p.height })
        }
    }

    p.mousePressed = () => {
        dotPositions.push({ x: p.mouseX, y: p.mouseY });
    }

    p.mouseDragged = () => {
        dotPositions.push({ x: p.mouseX, y: p.mouseY });
    }

    p.draw = () => {
        p.background(220);

        for (let i = poses.length; dotPositions.length && i < dotPositions.length; i++) {
            dotPositions[i] = { x: dotPositions[i].x, y: dotPositions[i].y + Math.sin((p.frameCount + i) / 60) * HOVERITENSITY };
        }

        const max = Math.min(poses.length, dotPositions.length);
        for (let i = 0; i < max; i++) {
            const toOrigin = p.createVector(poses[i].x, poses[i].y).sub(dotPositions[i].x, dotPositions[i].y);

            const move = dotSpeed * p.deltaTime;

            if (toOrigin.mag() < move) {
                dotPositions[i] = { x: poses[i].x, y: poses[i].y }
                continue;
            }

            const normal = toOrigin.normalize();

            dotPositions[i] = { x: dotPositions[i].x + normal.x * move, y: dotPositions[i].y + normal.y * move }
        }



        dotPositions.forEach(({ x, y }) => {
            p.circle(x, y, RADIUS);
        });
    }


    function newLine() {
        lineLength = 0;
        numberOfBRs++;
    }


    p.keyTyped = () => {
        if (p.key != 'Enter') {
            str += p.key;

            if (lineLength % 20 == 19) {
                newLine()
            }

            fillPoses(str[str.length - 1], { x: lineLength * 42, y: numberOfBRs * 60 });
            lineLength++;
        } else {
            newLine()
        }
    }
};

new p5(sketch, containerElement);
