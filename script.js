var id,
    min,
    sec,
    moves,
    t,
    inv,
    url,
    img,
    sig = 0;
var W = innerWidth;
var H = innerHeight;
var r = [1, 5, 9, 13];
var l = [4, 8, 12, 16];
var rl = [2, 3, 6, 7, 10, 11, 14, 15];
var images = ['wild', 'nature', 'fruits', 'cat', 'vegetables', 'house', 'car', 'skyscraper', 'cityscape', 'fastfood'];
var arr;
const init = () => {
    W = innerWidth;
    H = innerHeight;
    $('body').height(H + 'px');
    $('#ol').height(H + 'px');
};
window.onresize = init;

//Showing instructions
window.onload = function () {
    init();
    $('#ol').html(
        `<center><div id="inst"><h3>Welcome !</h3>Instructions For Game<br/><br/><li>Move the image pieces in grid to place them in correct order.</li><li>To move an image piece you can click on it.</li><li>A piece can be moved only if it has an empty block next to it.</li><br/>There are multiple images, re-run the code to get another image.</div><button onclick="start('s')" style="width:100px;font-size:18px;padding:5px;">Start</button></center>`
    );
};

//Creating array, setting timer and placing images according to array
function start() {
    url = 'https://source.unsplash.com/320x320/?' + images[Math.floor(Math.random() * images.length)] + '?sig=' + sig;
    sig++;
    $('#ol').hide();
    $('td').show();
    $('#1').attr('class', '');
    $('#hn').html('Show Numbers');
    //Timer
    (min = 0), (sec = 0), (moves = 0);
    $('#moves').html(moves);
    $('#time').html('00:00');
    clearInterval(t);
    var img = new Image();
    img.src = url;
    $(img).on('load', function () {
        t = setInterval(function () {
            sec++;
            if (sec == 60) {
                min++;
                sec = 0;
            }
            if (sec < 10) $('#time').html('0' + min + ':0' + sec);
            else $('#time').html('0' + min + ':' + sec);
        }, 1000);
    });

    $('td').html(``);

    //Generating array
    for (arr = [], i = 0; i < 15; ++i) arr[i] = i + 1;
    randomize();

    //Placing image pieces after randomizing
    for (var i = 0; i < arr.length; i++) {
        $('#' + (i + 1)).html(`<div><span>${arr[i]}</span><img src="${url}" class="${arr[i]}" id="c${arr[i]}"></div>`);
    }

    //Setting image position in each block
    var x = 0,
        y = 0,
        c = 1;
    for (var i = 1; i <= 16; i++) {
        x = 0;
        for (var j = 1; j <= 4; j++) {
            $('.' + c).css('object-position', x + 'px ' + y + 'px');
            x = x - 80;
            c++;
        }
        y = y - 80;
    }
}

//Randomizing array and checking if puzzle is possible to solve
function randomize() {
    inv = 0;

    //Shuffling array
    var tmp,
        c,
        p = arr.length;
    if (p)
        while (--p) {
            c = Math.floor(Math.random() * (p + 1));
            tmp = arr[c];
            arr[c] = arr[p];
            arr[p] = tmp;
        }

    //Checking if puzzle is possible to solve by counting inversions
    for (var i = 0; i < 15; i++) {
        for (var j = i + 1; j < 16; j++) {
            if (arr[j] && arr[i] && arr[i] > arr[j]) inv++;
        }
    }
    if (inv % 2 != 0) {
        randomize();
    }
}

$(function () {
    //Function when an image piece is clicked
    $('td').click(function () {
        var id = parseInt($(this).attr('id'));
        if (r.indexOf(id) != -1 || rl.indexOf(id) != -1) {
            if ($('#' + (id + 1)).html() == '') move(id, 1);
        }
        if (l.indexOf(id) != -1 || rl.indexOf(id) != -1) {
            if ($('#' + (id - 1)).html() == '') move(id, -1);
        }
        if (id <= 12) {
            if ($('#' + (id + 4)).html() == '') move(id, 4);
        }
        if (id >= 5) {
            if ($('#' + (id - 4)).html() == '') move(id, -4);
        }
        check();
    });

    //Showing original image
    $('#org').click(function () {
        $('#ol').html(
            `<div id="iol"><img style="height:350px;width:350px;" src="${url}"><br/><button onclick="hide()">Close</button></div>`
        );
        $('#ol').fadeIn(400);
    });

    //Showing or hiding numbers
    $('#hn').click(function () {
        $('td div span').toggle();
        if ($('td div span').css('display') == 'none') $('#hn').html('Show Numbers');
        else $('#hn').html('Hide Numbers');
    });
});

//Moving image piece
function move(h, n) {
    $('#' + (h + n)).html($('#' + h).html());
    $('#' + h).html('');
    moves++;
    $('#moves').html(`Moves: ${moves}`);
}

//Checking if puzzle is sloved yet
function check() {
    var c = 'true';
    for (i = 1; i <= 15; i++) {
        if (
            parseInt(
                $('#' + i)
                    .find('.' + i)
                    .attr('class')
            ) != i
        ) {
            c = 'false';
            break;
        }
    }

    if (c == 'true') {
        clearInterval(t);
        $('td').hide();
        $('#1').show();
        $('td').html('');
        $('#1').attr('class', 'org');
        $('#1').html(`<img src="${url}">`);
        $('td div span').hide();
        $('#hn').html('Show Numbers');
        $('img').hide();
        $('img').fadeIn(1500);
        setTimeout(function () {
            $('#ol').fadeIn(500);
            $(
                '#ol'
            ).html(`<div id="iol"> <h2>Congrats :)</h2><p id="info">You completed the puzzle in ${moves} moves. It took you ${min} minute(s) and ${sec} second(s).</p><span>Comment your score !</span><br/><button onclick="start()">Restart</button></div>  
    `);
        }, 2800);
    }
}

//Hide overlay div
function hide() {
    $('#ol').fadeOut(300);
}
