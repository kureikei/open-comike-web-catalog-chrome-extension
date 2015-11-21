chrome.contextMenus.create({
    title: "コミケ Web カタログのサークルページを開く",
    contexts: ["selection"],
    onclick: function (info, tab) {

        // 全角 to 半角
        var t = info.selectionText.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });

        // 半角カナ to 全角カナ
        t = t.replace(/[ﾊﾋﾌﾍﾎ]ﾟ/g, function (s) {
            return "パピプペポ".substr("ﾊﾋﾌﾍﾎ".indexOf(s[0]), 1);
        });
        t = t.replace(/[ｱ-ﾛ]/g, function (s) {
            return "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ".substr('ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛ'.indexOf(s), 1);
        });

        var i = -1;
        var day = 1;
        if ((i = t.search(/12\/29|29日|火曜|[1一]日目|火\W*[東西A-Zア-ロあ-れ]|初日/)) >= 0) day = 1;
        else if ((i = t.search(/12\/30|30日|水曜|[2二]日目|水\W*[東西A-Zア-ロあ-れ]/)) >= 0) day = 2;
        else if ((i = t.search(/12\/31|31日|木曜|[3三]日目|木\W*[東西A-Zア-ロあ-れ]|最終日/)) >= 0) day = 3;

        if (i > 0) { // 日付・曜日以降の値を使用
            t = t.substr(i);
        }

        if (!t.match(/(?:C89)?.*([A-Zア-ロあ-れ])\W*([0-9]{1,2})\W*([ab])?/)) {
            alert("サークルスペースがよくわかりません: " + t);
            return;
        }

        var block = RegExp.$1;
        if (block == "ぺ") block = "ペ"; // かな to カナ

        var space = ("0" + RegExp.$2).slice(-2) + RegExp.$3;
        var page = Math.floor((RegExp.$2 - 1) / 32) + 1;

        var hall = "";
        if (block.match(/[A-Zア-コ]/)) hall = "e123";
        else if (block.match(/[シ-ロ]/)) hall = "e456";
        else hall = "w12";

        var url = "https://webcatalog-free.circle.ms/Circle/List?hall=" + hall + "&block=" + escape(block) + "&day=" + day + "&page=" + page;
        chrome.tabs.create({
            url: url
        }, function (tab) {
            chrome.tabs.executeScript(null, { code: 'var trs=window.document.getElementsByTagName("tr");for(var i=0;i<trs.length;i++){if(trs[i].getAttribute("data-webcatalog-circle-space")=="' + space + '"){window.location.replace("https://webcatalog-free.circle.ms/Circle/"+trs[i].getAttribute("id"));break;}}' },
                function () { /*Do nothing*/ });
        });
    }
});
