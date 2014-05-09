var worker, editor, console;

$(document).ready(function () {
    worker = null;
    editor = $('#editor');
    console = $('#console');
    $('#run-btn').click(runCode);
});


function runCode() {
    console.text('');
    var code = "#include <Arduino.h>\n" + editor.text();
    if (worker) {
        worker.terminate();
    }
    worker = new Worker("picoc.min.js");
    worker.onmessage = function(event) {
        if (event.data.type == "write") {
            draw_led(event.data.pin, event.data.brightness);
        } else if (event.data.type == "msg") {
            console.append(event.data.msg + '\n');
        } else if (event.data.type == "error") {
            console.append('Error Line ' + event.data.line + ', Col ' + event.data.column) + '\n';
        } else {
            console.log("received other webworker event:");
            console.log(event);
        }
    };
    worker.postMessage({code: code});
};
