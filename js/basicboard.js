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
        setTimeout(draw_board, 1000);
        return;
    }
    cx.drawImage(img, 0, 0, 
        img.width, img.width*1.4,
        0, 0, cx.canvas.width, cx.canvas.height);
}

var BIG_X = 300,
    BIG_Y = 950,
    BIG_WIDTH = 300,
    BIG_HEIGHT = 108;

function draw_led(pin, opacity) {
    if (opacity != 0) draw_led(pin, 0);
    var img = $(opacity != 0 ? '#boardon' : '#boardoff')[0];
    var pini = pin-2;
    var xi = pini > 6 ? 0 : 1;
    var yi = 6 - (pini % 7);
    var sx = BIG_X + BIG_WIDTH * xi;
    var sy = BIG_Y + BIG_HEIGHT * yi;
    var ratio = img.width / cx.canvas.width;
    cx.globalAlpha = opacity == 0 ? 1 : opacity;
    cx.drawImage(img, sx, sy, BIG_WIDTH, BIG_HEIGHT,
        sx / ratio, sy / ratio, BIG_WIDTH / ratio, BIG_HEIGHT / ratio);
    cx.globalAlpha = 1;
}
