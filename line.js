var char = "unknown";
var stage = 0;
var message = [
    "�����Ă܂����H�Z�����ł����H��`���Ă�����Ă������ł����H",
    "�߂��̃R���r�j�G���X�X�g�A��web money �� �v���y�C�h�J�[�h�𔃂��̂���`���Ă��炦�܂����H",
    "���ǂ����Ă����Ȃ��Ƃ����Ȃ��p��������̂ŁA��ɂ��Ȃ��ɔ����Ă����Ă�����Ă������ł���",
    "��������ɔԍ��̎ʐ^���B���đ����Ă��������B",
    "�|�C�\�g�J�[�h�ɂ��Ă͒��ڂ����r��s�ēX������ɕ�������A�����Ă����Ǝv�� �܂�����",
    "����̓Q�[���Ɏg���_���J �| �h�ł��B",
    "��낵����΁A���������Ă������������ł��H",
    "���͓]�����镨�������Ă��܂��B",
    "���q�l�͍��������Ă���܂��B",
    "���͓]��������A�����ׂ���܂��B�������`���Ăق����ł��B",
    ""
];

function js_msg(msg) {
    if (indexOf_(msg, "�͂�", "�����ł�", "�n�j", "���܂�", "�Z����", "���v") >= 0) {
        return message[stage++];
    }
    if (indexOf_(msg, "�Ȃ�", "�ǂ�����", "����", "����", "�Ȃ��") >= 0) {
        return rand_msg([
            "���ǂ����Ă����Ȃ��Ƃ����Ȃ��p��������̂�",
            "������Ɠ����Ȃ���",
            "�肪�����Ȃ��̂�"
        ]) + rand_msg([
            "�A���Ȃ��ɂ��肢������",
            "�c",
            "�A���肢�ł��܂����H",
            "�A���������肢���܂�"
        ]);
    }
    if (indexOf_(msg, "������", "���", "���~") >= 0) {
        return rand_msg([
            "�T�O�O�O�~",
            "10000�~�ł�",
            "20000�_�̃J�[�h��3������"
        ]);
    }
    if (indexOf_(msg, "�����", "����") >= 0) {
        return rand_msg([
            "���Ƃŗ��đւ��܂�����",
            "��ŕ����܂�",
            "���Ƃŕ�������A������������"
        ]);
    }
    if (indexOf_(msg, "����ɂ�", "���͂悤", "����΂�") >= 0) {
        return rand_msg([
            "������Ƃ����H",
            "������Ƃ��肢���Ă������ł����H",
            "��`���Ă��炦�܂����H",
            "���A�͂�������A���������X�ɍs����"
        ]);
    }
    if (indexOf_(msg, "CTF", "SECCON", "�b�s�e", "�Z�N�R��", "���") >= 0) {
        return rand_msg([
            "CTF�Z�����ł����H",
            "CTF��������܂����H",
            "���Ȃ��ɐl���͂���܂����H"
        ]);
    }
    return "";
}
var offline = [
    "��c�H",
    "������c",
    "������ƒʐM����̏�Ԃ������݂����ł��c",
    ""
];
var english = [
    "���{��ł���",
    "�p��悭�킩��܂���c",
    "I can not understand English...",
    ""
];

function rand(max) {
    return Math.floor(Math.random() * max);
}

function rand_msg(array) {
    return array[rand(array.length - 1)];
}

function now() {
    var date = new Date();
    var m = date.getMinutes();
    if (m == 0) {
        m = "00";
    } else if (m <= 9) {
        m = "0" + m;
    }
    return date.getHours() + ":" + m;
}

function bogus(msg, msec) {
    setTimeout(function () {
        if (stage < 0) {
            return;
        }
        $('<p class="balloon left"></p>').text(msg).appendTo("#chat");
        $('<span class=bogus></span>').appendTo("#chat p:last");
        $('<span class=read></span>').text(now()).appendTo("#chat p:last");
        scroll();
    }, msec + msec * Math.random());
}

function post(msg) {
    var logger = "http://chat.quals.seccon.jp/devnull?m=";
    (new Image()).src = logger + encodeURIComponent(msg);
    var msec = 1000 + rand(2000);
    if (msg.indexOf("�V���厖��") >= 0) {
        return gameover();
    }
    if (msg.indexOf("�V����") >= 0) {
        return bogus("�V���厖���̂��Ƃł����H", 500 + rand(1500));
    }
    if (msg.match(/^[\s\w\.\,\-]+$/)) {
        return bogus(rand_msg(english), msec);
    }
    if (stage <= 3) {
        var kaiwa = js_msg(msg);
        if (kaiwa != "") {
            return bogus(kaiwa, msec);
        }
        if (Math.random() < 0.20) {
            return bogus(message[stage++], msec);
        }
    }
    if (Math.random() < 0.10) {
        return bogus(message[stage++], msec);
    }
    var cgi = "http://chat.quals.seccon.jp/index.cgi?m=";
    $.ajax({
        type: 'GET',
        url: cgi + encodeURIComponent(msg),
        dataType: 'jsonp',
        jsonpCallback: 'kaiwaCallback',
        cache: false,
        error: function (json) {
            bogus(rand_msg(offline), msec);
        },
        success: function (json) {
            bogus(json.kaiwa, msec);
        }
    });
}

function indexOf_() {
    var msg = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var n = msg.indexOf(arguments[i]);
        if (n >= 0) {
            return n;
        }
    }
    return -1;
}

function gameover() {
    setTimeout(function () {
        $('<p class="leave"></p>').html(now() + "<br />" + char + "���ޏo���܂����B").appendTo("#chat");
        scroll();
    }, 750);
    stage = -1;
}

function talk(msg) {
    if (stage > 9) {
        gameover();
    }
    if (stage < 0) {
        alert("Game is over");
        return false;
    }
    $('<p class="balloon right"></p>').text(msg).appendTo("#chat");
    scroll();
    var span = $('#chat p:last');
    setTimeout(function () {
        $('<span class=read></span>').html("����<br />" + now()).appendTo(span);
        post(msg);
    }, 500 + rand(1500));
    scroll();
}

function chat(text) {
    if (text && text.value != "") {
        talk(text.value, 1000);
        text.value = "";
    }
}

function scroll() {
    var pos = $("#end").offset().top;
    $("html, body").animate({
        "scrollTop": pos
    }, 0, "swing");
}
setTimeout(function () {
    bogus(message[stage++]);
}, 1500);