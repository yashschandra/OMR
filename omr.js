var omr = document.getElementById("omr");
var gridSize = {
    "x": 18,
    "y": 18
};
var SINGLE_CHOICE = 1;
var INTEGER_CHOICE = 2;
var MATRIX_MATCH = 3;
var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;
var ids = [];
var attributes = [];
var questions = [];

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

function newQuestion(id, x, y, type, start, len, number, n) {
    var question;
    switch (type) {
        case SINGLE_CHOICE:
            question = newSingleChoice(x, y, start, len, number);
        break;
        case INTEGER_CHOICE:
            question = newIntegerChoice(x, y, start, len, number);
        break;
        case MATRIX_MATCH:
            question = newMatrixMatch(x, y, start, len, number, n);
        break;
    }
    question.setAttribute('id', id);
    return question;
}

function addAttribute() {
    clearElement();
    var name = document.getElementById("attributeName").value;
    var cols = document.getElementById("attributeCols").value;
    var options = document.getElementById("attributeOptions").value;
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
    var element = {};
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
    addElement(element, true);
}

function addQuestion() {
    clearElement();
    var number = document.getElementById("questionNumber").value;
    var cols = document.getElementById("questionCols").value;
    var type = Number(document.getElementById("questionType").value);
    var options = document.getElementById("questionOptions").value;
    var start = 'A';
    var len = 0;
    switch(options) {
        case "1":
            start = 'A';
            len = 4;
        break;
        case "2":
            start = 'A';
            len = 5;
        break;
        case "3":
            start = 'P';
            len = 5;
        break;
        case "4":
            start = '0';
            len = 10;
        break;
        default:
        break;
    }
    var x = 0, y = 0;
    var element = {};
    element["id"] = generateId();
    element["type"] = "question";
    element["data"] = {
        number: number,
        type:type,
        cols: cols,
        options: options,
        start: start,
        len: len,
        x: x,
        y: y
    };
    addElement(element, true);
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

function removeElement(id) {
    var ele = document.getElementById(String(id));
    console.log(ele, id);
    if(ele) {
        ele.parentNode.removeChild(ele);
    }
    for(var i=0; i<attributes.length; i++) {
        if(attributes[i].id == id) {
            attributes.splice(i, 1);
            break;
        }
    }
    for(var i=0; i<questions.length; i++) {
        if(questions[i].id == id) {
            questions.splice(i, 1);
            break;
        }
    }
}

function clearElement(id) {
    removeElement(id);
    refreshElementList();
}

function addElement(element, newElement) {
    var e;
    switch (element.type) {
        case "attribute":
            e = newAttribute(element.id, element.data.x, element.data.y, element.data.start, element.data.len, element.data.name, element.data.cols);
            attributes.push(element);
        break;
        case "question":
            e = newQuestion(element.id, element.data.x, element.data.y, element.data.type, element.data.start, element.data.len, element.data.number, element.data.cols);
            questions.push(element);
        break;
        default:
        break;
    }
    omr.appendChild(e);
    if(newElement) {
        refreshElementList();
    }
}

function refreshElementList() {
    var html = '';
    for(var i=0; i<attributes.length; i++) {
        html += "<div id='"+ attributes[i].id +"_div'>ATTRIBUTE : "+ attributes[i].data.name+" &nbsp; "+buttonHTML(attributes[i].id)+"</div>";
    }
    for(var i=0; i<questions.length; i++) {
        html += "<div id='"+ questions[i].id +"_div'>QUESTION : "+ questions[i].data.number+" &nbsp; "+buttonHTML(questions[i].id)+"</div>";
    }
    document.getElementById("elements").innerHTML = html;
}

function buttonHTML(id) {
    var html = '';
    html += '<button type="button" onclick="shiftElement('+id+','+UP+')">UP</button>';
    html += '<button type="button" onclick="shiftElement('+id+','+DOWN+')">DOWN</button>';
    html += '<button type="button" onclick="shiftElement('+id+','+LEFT+')">LEFT</button>';
    html += '<button type="button" onclick="shiftElement('+id+','+RIGHT+')">RIGHT</button>';
    html += '<button type="button" onclick="clearElement('+id+')">REMOVE</button>';
    return html;
}

function shiftElement(id, dir) {
    var ele;
    for(var i=0; i<attributes.length; i++) {
        if(attributes[i].id == id) {
            ele = attributes[i];
            break;
        }
    }
    for(var i=0; i<questions.length; i++) {
        if(questions[i].id == id) {
            ele = questions[i];
            break;
        }
    }
    switch(dir) {
        case UP:
            ele.data.y = ele.data.y - gridSize.y;
        break;
        case DOWN:
            ele.data.y = ele.data.y + gridSize.y;
        break;
        case LEFT:
            ele.data.x = ele.data.x - gridSize.x;
        break;
        case RIGHT:
            ele.data.x = ele.data.x + gridSize.x;
        break;
        default:
        break;
    }
    modifyElement(ele);
}

function modifyElement(ele) {
    removeElement(ele.id);
    addElement(ele, false);
}