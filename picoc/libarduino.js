var LibraryArduino = {
    pinMode: function() {},
    analogWriteJS: function(pin, brightness) {
        postMessage({type: "write", pin: pin - 2, brightness: brightness});
    },
    digitalWriteJS: function(pin, enable) {
        postMessage({type: "write", pin: pin - 2, brightness: enable ? 255 : 0});
    },
    delay: function(msec) {
	// FUGLY
	var start = Date.now();
        while (Date.now() - start < msec) {
            // Do nothing
        }
    },
    sendMessage: function(msg) {
        postMessage({type: "msg", msg: Module.Pointer_stringify(msg)});
    },
    sendError: function(fileName, sourceText, line, column) {
        postMessage({type: "error", fileName: fileName, sourceText: sourceText,
                    line: line, column: column});
    }
};

mergeInto(LibraryManager.library, LibraryArduino);
