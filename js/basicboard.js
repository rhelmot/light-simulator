var cx;

$(document).ready( function () {
    cx = $('#canvas')[0].getContext('2d');
    draw_board();
});

function draw_board() {
    cx.canvas.width = 500;
    cx.canvas.height = 700;
    var img = $('#boardoff')[0];
    if (!img.complete) {
        setTimeout(draw_board, 100);
        return;
    }
    cx.drawImage(img, 0, 0, 
        img.width, img.width*1.4,
        0, 0, cx.canvas.width, cx.canvas.height);
}

var SMALL_X = 300 / 2.65,
    SMALL_Y = 950 / 2.65,
    SMALL_WIDTH = 300 / 2.65,
    SMALL_HEIGHT = 108 / 2.65;

function draw_led(pin, opacity) {
    if (opacity != 0) draw_led(pin, 0);
    var img = $(opacity != 0 ? '#boardon' : '#boardoff')[0];
    var pini = pin-2;
    var xi = pini > 6 ? 0 : 1;
    var yi = 6 - (pini % 7);
    var sx = SMALL_X + SMALL_WIDTH * xi;
    var sy = SMALL_Y + SMALL_HEIGHT * yi;
    var ratio = img.width / cx.canvas.width;
    cx.globalAlpha = opacity == 0 ? 1 : opacity;
    cx.drawImage(img, sx * ratio, sy * ratio, SMALL_WIDTH * ratio, SMALL_HEIGHT * ratio,
        sx, sy, SMALL_WIDTH, SMALL_HEIGHT);
    cx.globalAlpha = 1;
}
