var char = "unknown";
var stage = 0;
var message = [
    "何してますか？忙しいですか？手伝ってもらってもいいですか？",
    "近くのコンビニエンスストアでweb money の プリペイドカードを買うのを手伝ってもらえますか？",
    "今どうしてもやらないといけない用事があるので、先にあなたに買っておいてもらってもいいですか",
    "買った後に番号の写真を撮って送ってください。",
    "ポイソトカードについては直接つンユビ二行て店員さんに聞いたら、教ぇてくれると思い ますけど",
    "それはゲームに使う点数カ － ドです。",
    "よろしければ、すぐ買っていただきたいです？",
    "私は転売する物を持ってきます。",
    "お客様は高く買ってくれます。",
    "私は転売したら、少し儲かります。だから手伝ってほしいです。",
    ""
];

function js_msg(msg) {
    if (indexOf_(msg, "はい", "いいです", "ＯＫ", "やります", "忙しい", "大丈夫") >= 0) {
        return message[stage++];
    }
    if (indexOf_(msg, "なぜ", "どうして", "何故", "何で", "なんで") >= 0) {
        return rand_msg([
            "今どうしてもやらないといけない用事があるので",
            "ちょっと動けなくて",
            "手が離せないので"
        ]) + rand_msg([
            "、あなたにお願いしたい",
            "…",
            "、お願いできますか？",
            "、今すぐお願いします"
        ]);
    }
    if (indexOf_(msg, "いくら", "幾ら", "何円") >= 0) {
        return rand_msg([
            "５０００円",
            "10000円です",
            "20000点のカードを3枚買っ"
        ]);
    }
    if (indexOf_(msg, "そんな", "お金") >= 0) {
        return rand_msg([
            "あとで立て替えますから",
            "後で払います",
            "あとで払うから、今すぐ買って"
        ]);
    }
    if (indexOf_(msg, "こんにち", "おはよう", "こんばん") >= 0) {
        return rand_msg([
            "ちょっといい？",
            "ちょっとお願いしてもいいですか？",
            "手伝ってもらえますか？",
            "挨拶はいいから、今すぐお店に行って"
        ]);
    }
    if (indexOf_(msg, "CTF", "SECCON", "ＣＴＦ", "セクコン", "問題") >= 0) {
        return rand_msg([
            "CTF忙しいですか？",
            "CTF何問解けました？",
            "あなたに人権はありますか？"
        ]);
    }
    return "";
}
var offline = [
    "ん…？",
    "あれっ…",
    "ちょっと通信回線の状態が悪いみたいです…",
    ""
];
var english = [
    "日本語でおｋ",
    "英語よくわかりません…",
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
    if (msg.indexOf("天安門事件") >= 0) {
        return gameover();
    }
    if (msg.indexOf("天安門") >= 0) {
        return bogus("天安門事件のことですか？", 500 + rand(1500));
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
        $('<p class="leave"></p>').html(now() + "<br />" + char + "が退出しました。").appendTo("#chat");
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
        $('<span class=read></span>').html("既読<br />" + now()).appendTo(span);
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