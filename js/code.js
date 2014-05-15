var worker, editor, consolee, cEditor, button;

$(document).ready(function () {
    worker = null;
    editor = $('#editor');
    button = $('#run-btn');
    consolee = $('#console');
    editor.text('savedcode' in localStorage ? localStorage.savedcode : 'void setup () {\n  \n}\n\nvoid loop () {\n  \n}\n');
    cEditor = CodeMirror.fromTextArea(editor[0], {
        lineNumbers: true,
        matchBrackets: true,
        mode: "text/x-csrc"
    });
    cEditor.setSize('100%', 400);
    button.click(toggleRun);
    document.addEventListener('keydown', function (e) {
        if(e.ctrlKey && e.keyIdentifier == 'Enter') {
            e.preventDefault();
            toggleRun();
        }
    });
    setInterval(saveCode, 5000);
});

var widhtdt = -1;

function runCode() {
    consolee.text('');
    clearErrors();
    var code = "#include <Arduino.h>\n" + cEditor.getValue();
    worker = new Worker("js/picoc.min.js");
    worker.onmessage = function(event) {
        if (event.data.type == "write") {
            draw_led(event.data.pin, event.data.brightness);
        } else if (event.data.type == "msg") {
            consolee.append(event.data.msg + '\n');
        } else if (event.data.type == "error") {
            consolee.append('Error Line ' + event.data.line + ', Col ' + event.data.column + '\n');
            setError(event.data.line - 1);
            clearTimeout(widhtdt);
            widhtdt = setTimeout(stopCode, 500);
        } else {
            console.log("received other webworker event:");
            console.log(event);
        }
    };
    worker.postMessage({code: code});
    button.text('Stop');
};

function stopCode() {
    if (worker) {
        worker.terminate();
    }
    button.text('Run');
}

function toggleRun () {
    if (button.text() == 'Run') runCode();
    else stopCode();
}

function saveCode() {
    if (!cEditor.isClean()) {
        localStorage.setItem("savedcode", cEditor.getValue());
        cEditor.markClean();
    }
}

function setError(line) {
    cEditor.addLineClass(line, 'background', 'line-error');
}

function clearErrors() {
    for (var i = 0; i <= cEditor.lastLine(); i++) {
        cEditor.removeLineClass(i, 'background', 'line-error');
    }
}
