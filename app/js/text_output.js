document.getElementById("textoutput").addEventListener('click', function () {
    if (window.File) {
        // File APIに関する処理を記述
        //window.alert("File APIが実装されてます。");
    } else {
        window.alert("本ブラウザではFile APIが使えません");
    }
    var sub_win;
    sub_win = window.open("output.html");
}, false);

document.getElementById("redisplay").addEventListener('click', function () {
    console.log(document.getElementById("targetDate").value);
    
    parameter = `${document.getElementById("targetDate").value}`;  
    location.href = 'register.html?targetdate='+parameter
}, false);

document.getElementById("textregistration").addEventListener('click', function () {
    if (!confirm("登録しますか"))
        return;
    var objTBL = document.getElementById("achievementTable");
    if (!objTBL)
        return;


        for (var i = 1; i < objTBL.rows.length; i++) {
            var updateFlg = document.getElementById("editFlg" + i);
            //更新or追加対象
            if (updateFlg.value == 1) {
                //レスポンス
                var response = {};
                //リクエスト
                let request = {
                    target_date: document.getElementById("targetDate").value,
                    number: i,
                    item: encodeURI(document.getElementById("item" + i).value),
                    content: encodeURI(document.getElementById("content" + i).value),
                    ItemId: encodeURI(document.getElementById("Id" + i).value)
                };
                //ajax
                $.ajax({
                    url: '/cgi/Achievement/registAchievement.py',
                    type: "POST",
                    data: JSON.stringify(request),  //object -> json
                    async: true,                    //true:非同期(デフォルト), false:同期
                    dataType: "json",
                    success: function (data) {
                        response = data;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
                    }
                });
            }
        }
    alert('登録しました')
}, false);

function RegisterOnLoad() {
    //今日の日時を表示
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var toTwoDigits = function (num, digit) {
        num += ''
        if (num.length < digit) {
            num = '0' + num
        }
        return num
    }
    var getParam = function(name,url){
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    var prm = getParam("targetdate")

    document.getElementById("targetDate").value = prm;
    makeCalendar();
    getData();
}

function makeCalendar() {
    //日付の設定
    now = new Date();
    //now = new Date("2008/9/19");
    year = now.getYear();
    if (year < 1900) year += 1900;
    mon = now.getMonth() + 1;
    day = now.getDate();
    you = now.getDay();

    //年数の範囲
    h_year = 1;

    //曜日の選択肢
    youbi = new Array("日", "月", "火", "水", "木", "金", "土");
    youbi_color = new Array("ff0000", "", "", "", "", "", "0000ff");
    //表示の設定
    today = year + "年" + mon + "月" + day + "日" + "(<font color='" + youbi_color[you] + "'>" + youbi[you] + "</font>)";

    //画面に表示
    //        document.write(today);
    //       document.write("<hr>");

    setOption();
    view_cal(year, mon);
}

function setOption() {
    var n;
    //年
    document.fym.syear.length = h_year * 2 + 1;
    for (n = 0; n < 3; n++) {
        document.fym.syear[n].text = n + year - h_year;
        document.fym.syear[n].value = n + year - h_year;
    }
    document.fym.syear[h_year].selected = true;
    //月
    document.fym.smon.length = 12;
    for (n = 0; n < 12; n++) {
        document.fym.smon[n].text = n + 1;
        document.fym.smon[n].value = n + 1;
    }
    document.fym.smon[mon - 1].selected = true;
}


function view_cal(cy, cm) {
    get_cal = "";
    //各月の1日を決定
    fday = new Date(cy + "/" + cm + "/1");
    fyou = fday.getDay();
    //各月の末日を決定
    lday = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if ((cy % 4 == 0 && cy % 100 != 0) || (cy % 400 == 0)) { lday[1]++; }

    //カレンダー表示
    get_cal += "<table border='2'>";
    //get_cal += "<tr><th colspan='7'>" + cy + "年" + cm + "月</th></tr>";
    get_cal += "<tr>";
    for (m = 0; m < 7; m++) {
        get_cal += "<th><font color='" + youbi_color[m] + "'>" + youbi[m] + "</font></th>";
    }
    get_cal += "</tr>";
    for (n = 0; n < 6; n++) {
        get_cal += "<tr>";
        for (m = 0; m < 7; m++) {
            d = (n * 7 + m + 1 - fyou);
            if (year == cy && mon == cm && day == d) { get_cal += "<td align='right' bgcolor='#ffaaaa>"; }
            else { get_cal += "<td align='right'>"; }
            if (d > 0 && d <= lday[mon - 1]) { get_cal += "<font color='" + youbi_color[m] + "'>" + d + "</font>"; }
            else { get_cal += "&nbsp;"; }
            get_cal += "</td>";
        }
        get_cal += "</tr>";
        if (d >= lday[mon - 1]) break;
    }
    get_cal += "</table>";
    //出力
    document.getElementById("calendar").innerHTML = get_cal;
}

function change_cal() {
    cy = document.fym.syear.value;
    cm = document.fym.smon.value;

    view_cal(cy, cm);
}

function change_month(ch) {
    cy = document.fym.syear.selectedIndex;
    cm = document.fym.smon.selectedIndex;

    if (ch > 0) {
        cy = cy + Math.floor(ch / 12);
        cm = cm + ch % 12;
    } else {
        ch = Math.abs(ch);
        cy = cy - Math.floor(ch / 12);
        cm = cm - ch % 12;
    }

    if (cm > 11) { cy += 1; cm -= 12; }
    if (cm < 0) { cy -= 1; cm += 12; }

    //選択可能年数による制御
    if (cy < 0) { cy = 0; cm = 0; }
    if (cy > h_year * 2) { cy = h_year * 2; cm = 11; }

    document.fym.syear[cy].selected = true;
    document.fym.smon[cm].selected = true;

    cy = document.fym.syear.value;
    view_cal(cy, cm + 1);
}

function change_form(cy, cm) {
    view_cal(cy, cm);
    cy = cy - year + h_year;
    cm = cm - 1;
    document.fym.syear[cy].selected = true;
    document.fym.smon[cm].selected = true;
}


function getData() {
    //レスポンス
    var response = {};
    //リクエスト
    let request = {
        target_date: document.getElementById("targetDate").value
    };
    //ajax
    $.ajax({
        url: '/cgi/Achievement/getData.py',
        type: "POST",
        data: JSON.stringify(request),  //object -> json
        async: true,                    //true:非同期(デフォルト), false:同期
        dataType: "json",
        success: function (data) {
            response = data;
            document.getElementById("achievementList").innerHTML = response.responsedata;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
        }
    });
}


function OutputOnLoad() {
    target = document.getElementById("output");
    if (!window.opener || window.opener.closed) { // メインウィンドウの存在をチェック

        window.alert('メインウィンドウがありません'); // 存在しない場合は警告ダイアログを表示
        return false;
    }
    document.getElementById("registdate").textContent = window.opener.document.getElementById('targetDate').value + "の進捗";

    var table = window.opener.document.getElementById('targetTable');
    for (let row of table.rows) {
        for (let cell of row.cells) {
            var text = document.createTextNode(cell.firstChild.value);
            if (text.textContent != 'undefined') {
                if (cell.firstChild.className == "header") {
                    var myp = document.createElement("h1");
                    text.textContent = "[" + text.textContent + "]";
                    myp.appendChild(text);
                    target.appendChild(myp);
                }
                else if (cell.firstChild.className == "content") {
                    var myp = document.createElement("p");
                    myp.appendChild(text);
                    target.appendChild(myp);

                }
            }
        }

    }
}

function appendRow(){
    var objTBL = document.getElementById("achievementTable");
    if (!objTBL)
        return;
    
    var count = objTBL.rows.length;

    // 最終行に新しい行を追加
    var row = objTBL.insertRow(count);

    // 列の追加
    var c1 = row.insertCell(0);
    var c2 = row.insertCell(1);
    var c3 = row.insertCell(2);
    var c4 = row.insertCell(3);
    var c5 = row.insertCell(4);
    var c6 = row.insertCell(5);

    // 各列にスタイルを設定
    c4.style.cssText = 'display: none;';
    c5.style.cssText = 'display: none;';
    
    // 各列に表示内容を設定
    c1.innerHTML = '<span class="seqno">' + count + '</span>';
    c2.innerHTML = '<input type="text" class="item" size="20" maxlength="20" id="item'+count+'" value="" onchange="dataEdit(this)">'
    c3.innerHTML = '<textarea class="content" id="content'+count+'" rows="4" cols="40" maxlength="100" onchange="dataEdit(this)"></textarea>'
    c4.innerHTML = '<input type="text" class="editFlg" size="3" maxlength="2" id="editFlg'+count+'" value="0">';
    c5.innerHTML = '<input type="text" class="Id" size="3" maxlength="2" id="Id'+count+'" value="">'
    c6.innerHTML = '<input type="button" class="deleteBtn" id="deleteBtn' + count + '" value="削除" onclick="deleteRow(this)">';
    
    // 追加した行の入力フィールドへフォーカスを設定
    var objInp = document.getElementById("item" + count);
    if (objInp)
        objInp.focus();
    
}

function dataEdit(obj) {
    var objTR = obj.parentNode.parentNode;
    var rowId = objTR.sectionRowIndex;
    if (document.getElementById("editFlg" + rowId).value == 0) {
        document.getElementById("editFlg" + rowId).value = 1
    }

}

function deleteRow(obj) {
    if (!confirm("この行を削除しますか？"))
        return;
    var objTR = obj.parentNode.parentNode;
    var objTBL = objTR.parentNode;
    var rowId = objTR.sectionRowIndex;
    if (!obj)
        return;
    console.log(document.getElementById("Id" + rowId).value)
    //既にDBに登録されている場合(old項目が入っている場合)
    if (document.getElementById("Id" + rowId).value) {
        //レスポンス
        var response = {};
        //リクエスト
        let request = {
            item_id: document.getElementById("Id" + rowId).value,
            target_date: document.getElementById("targetDate").value
        };
        //ajax
        $.ajax({
            url: '/cgi/Achievement/deleteAchievement.py',
            type: "POST",
            data: JSON.stringify(request),  //object -> json
            async: true,                    //true:非同期(デフォルト), false:同期
            dataType: "json",
            success: function (data) {
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
            }
        });
        console.log("DBDelete")
    }

    if (objTBL)
        objTBL.deleteRow(objTR.sectionRowIndex);

    // <span> 行番号ふり直し
    var tagElements = document.getElementsByTagName("span");
    if (!tagElements)
        return false;

    var seq = 1;
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].className.match("seqno"))
            tagElements[i].innerHTML = seq++;
    }

    // id ふり直し
    var tagElements = document.getElementsByTagName("input");
    if (!tagElements)
        return false;

    // <input type="checkbox" id="check">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].className.match("check")) {
            tagElements[i].setAttribute("id", "check" + String(seq));
            ++seq;
        }
    }
    // <input type="text" id="content">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].className.match("content")) {
            tagElements[i].setAttribute("id", "content" + String(seq));
            ++seq;
        }
    }

    // <input type="text" id="editFlg">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].className.match("editFlg")) {
            tagElements[i].setAttribute("id", "editFlg" + String(seq));
            ++seq;
        }
    }

    // <input type="text" id="Id">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].className.match("Id")) {
            tagElements[i].setAttribute("id", "Id" + String(seq));
            ++seq;
        }
    }

    // <input type="button" id="deleteBtn">

    seq = 1;
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].className.match("deleteBtn")) {
            tagElements[i].setAttribute("id", "deleteBtn" + String(seq));
            ++seq;
        }
    }

}