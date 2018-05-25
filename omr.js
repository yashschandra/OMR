var omr = document.getElementById("omr");
var gridSize = {
    "x": 18,
    "y": 18
};
var SINGLE_CHOICE = 1;
var MULTIPLE_CHOICE = 2;
var INTEGER_CHOICE = 3;
var MATRIX_MATCH = 4;
var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;
var ids = [];

function newElement(type) {
    var ele = document.createElementNS("http://www.w3.org/2000/svg", type);
    return ele;
}

function newCircle(cx, cy, r, stroke, fill) {
    var circle = newElement("circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("fill", fill);
    return circle;
}

function newRectangle(x, y, width, height, stroke, fill) {
    var rect = newElement("rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.style.stroke = stroke;
    rect.style.fill = fill;
    return rect;
}

function newText(x, y, fill, content, size) {
    var text = newElement("text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("fill", fill);
    text.textContent = content;
    text.style.fontSize = size;
    text.style.textAnchor = "middle";
    return text;
}

function newBubble(x, y, content) {
    var bubble = newElement("g");
    var circle = newCircle(x+gridSize.x/2, y+gridSize.y/2, gridSize.x/2-4, "black", "white");
    var text = newText(x+gridSize.x/2, y+gridSize.y/2+gridSize.y/8, "black", content, gridSize.x/2-4);
    bubble.appendChild(circle);
    bubble.appendChild(text);
    return bubble;
}

function newOptions(x, y, start, len, rowWise) {
    var options = newElement("g");
    var bubble;
    for(var i=0; i<len; i++) {
        if(rowWise) {
            bubble = newBubble(x+i*gridSize.x, y, String.fromCharCode(start.charCodeAt(0)+i));
        }
        else {
            bubble = newBubble(x, y+i*gridSize.y, String.fromCharCode(start.charCodeAt(0)+i));
        }
        options.appendChild(bubble);
    }
    return options;
}

function newBoxes(x, y, len, rowWise) {
    var boxes = newElement("g");
    var rect;
    for(var i=0; i<len; i++) {
        if(rowWise) {
            rect = newRectangle(x+i*gridSize.x, y, gridSize.x, gridSize.y, "black", "white");
        }
        else {
            rect = newRectangle(x, y+i*gridSize.y, gridSize.x, gridSize.y, "black", "white");
        }
        boxes.appendChild(rect);
    }
    return boxes;
}

function newAttribute(id, x, y, start, len, name, cols) {
    var attribute = newElement("g");
    attribute.setAttribute("id", id);
    var rect = newRectangle(x, y, gridSize.x*cols, gridSize.y*(len+2), "black", "white");
    var boxes = newBoxes(x, y+gridSize.y, cols, true);
    var text = newText(x+cols*gridSize.x/2-name.length/2, y+gridSize.y/2, "black", name, gridSize.x/2-2);
    attribute.appendChild(rect);
    attribute.appendChild(boxes);
    attribute.appendChild(text);
    var options;
    for(var i=0; i<cols; i++) {
        options = newOptions(x+i*gridSize.x, y+2*gridSize.y, start, len, false);
        attribute.appendChild(options);
    }
    return attribute;
}

function newSingleChoice(x, y, start, len, number) {
    var question = newElement("g");
    var text = newText(x+gridSize.x/2, y+5*gridSize.y/8, "black", number, gridSize.x/2-2);
    var options = newOptions(x+gridSize.x, y, start, len, true);
    question.appendChild(text);
    question.appendChild(options);
    return question;
}

function newIntegerChoice(x, y, start, len, number) {
    var question = newElement("g");
    var text = newText(x+gridSize.x/2, y+5*gridSize.y/8, "black", number, gridSize.x/2-2);
    var options = newOptions(x+gridSize.x, y, start, len, true);
    question.appendChild(text);
    question.appendChild(options);
    return question;
}

function newMatrixMatch(x, y, start, len, number, n) {
    var question = newElement("g");
    var text = newText(x+gridSize.x/2, y+5*gridSize.y/8, "black", number, gridSize.x/2-2);
    var part;
    var options;
    question.appendChild(text);
    for(var i=0; i<n; i++) {
        part = newText(x+gridSize.x/2, y+5*gridSize.y/8+(i+1)*gridSize.y, "black", String.fromCharCode("A".charCodeAt(0)+i), gridSize.x/2-2);
        options = newOptions(x+gridSize.x, y+(i+1)*gridSize.y, start, len, true);
        question.appendChild(part);
        question.appendChild(options);
    }
    return question;
}

function newQuestion(x, y, type, start, len, number, n) {
    var question;
    switch (type) {
        case SINGLE_CHOICE:
        case MULTIPLE_CHOICE:
            question = newSingleChoice(x, y, start, len, number);
        break;
        case INTEGER_CHOICE:
            question = newIntegerChoice(x, y, start, len, number);
        break;
        case MATRIX_MATCH:
            question = newMatrixMatch(x, y, start, len, number, n);
        break;
    }
    return question;
}

function addAttribute() {
    var name = document.getElementById("name").value;
    var cols = document.getElementById("cols").value;
    var options = document.getElementById("options").value;
    var start = "A";
    var len = 0;
    switch (options) {
        case "1":
            start = "A";
            len = 4;
        break;
        case "2":
            start = "A";
            len = 26;
        break;
        case "3":
            start = "0";
            len = 10;
        break;
        default:
        break;
    }
    var x = 0, y = 0;
    element["id"] = generateId();
    element["type"] = "attribute";
    element["data"] = {
        name: name,
        cols: cols,
        options: options,
        start: start,
        len: len,
        x: x,
        y: y
    };
    modifyOMR();
}

function generateId() {
    var id = Math.floor(Math.random()*1000000);
    for(var i= 0; i<ids.length; i ++) {
        if(id == ids[i]) {
            break;
        }
    }
    if(i == ids.length) {
        ids.push(id);
        return id;
    }
    return generateId();
}

function modifyOMR() {
    removeElement();
    addElement();
}

function removeElement() {
    var ele = document.getElementById(String(element.id));
    console.log(ele, element.id);
    if(ele) {
        ele.parentNode.removeChild(ele);
    }
}

function addElement() {
    var e;
    switch (element.type) {
        case "attribute":
            e = newAttribute(element.id, element.data.x, element.data.y, element.data.start, element.data.len, element.data.name, element.data.cols);
        break;
        case "question":
        break;
        default:
        break;
    }
    omr.appendChild(e);
}

function shiftElement(dir) {
    switch(dir) {
        case UP:
            element.data.y = element.data.y - gridSize.y;
        break;
        case DOWN:
            element.data.y = element.data.y + gridSize.y;
        break;
        case LEFT:
            element.data.x = element.data.x - gridSize.x;
        break;
        case RIGHT:
            element.data.x = element.data.x + gridSize.x;
        break;
        default:
        break;
    }
    modifyOMR();
}

/*omr.appendChild(newAttribute(100, 100, "A", 26, "NAME", 20));
omr.appendChild(newAttribute(700, 100, "0", 10, "NUMBER", 10));
omr.appendChild(newAttribute(900, 100, "A", 4, "SET", 1));
omr.appendChild(newQuestion(1000, 100, SINGLE_CHOICE, "A", 5, 1, 1));
omr.appendChild(newQuestion(1000, 200, MULTIPLE_CHOICE, "A", 5, 1, 1));
omr.appendChild(newQuestion(500, 300, INTEGER_CHOICE, "0", 10, 1, 1));
omr.appendChild(newQuestion(1100, 300, MATRIX_MATCH, "P", 5, 1, 4));*/