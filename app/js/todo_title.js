
function ToDoTitleOnLoad() {
    //レスポンス
    var response = {};
    //リクエスト
    let request = {
        enable_flg: document.getElementById("enable").checked
    };
    //ajax
    $.ajax({
        url: '/cgi/ToDoTitle/displayToDoTitle.py',
        type: "POST",
        data: JSON.stringify(request),  //object -> json
        async: true,                    //true:非同期(デフォルト), false:同期
        dataType: "json",
        success: function (data) {
            response = data;
            document.getElementById("todo_title").innerHTML = response.todo_title;

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
        }
    });
}

function sortableSet(obj) {

    if (obj.value == "並べ替え") {
        $('#sortdata').sortable({
            stop: $('#sortdata').bind('sortstop', function () {
                // 番号を設定している要素に対しループ処理
                $(this).find('[class="seqno"]').each(function (idx) {
                    // タグ内に通し番号を設定（idxは0始まりなので+1する）
                    $(this).html(idx + 1);
                });
                $(this).find('[class="check"]').each(function (idx) {
                    // タグ内に通し番号を設定（idxは0始まりなので+1する）
                    this.id = "check" + String(idx + 1);
                });
                $(this).find('[class="content"]').each(function (idx) {
                    // タグ内に通し番号を設定（idxは0始まりなので+1する）
                    this.id = "content" + String(idx + 1);
                });
                $(this).find('[class="editFlg"]').each(function (idx) {
                    // タグ内に通し番号を設定（idxは0始まりなので+1する）
                    this.id = "editFlg" + String(idx + 1);
                });
                $(this).find('[class="Id"]').each(function (idx) {
                    // タグ内に通し番号を設定（idxは0始まりなので+1する）
                    this.id = "Id" + String(idx + 1);
                });
                $(this).find('[class="deleteBtn"]').each(function (idx) {
                    // タグ内に通し番号を設定（idxは0始まりなので+1する）
                    this.id = "deleteBtn" + String(idx + 1);
                });
            })
        });
        obj.value = "並べ替え完了"
    }
    else{
        obj.value = "並べ替え"
        if (!confirm("並べ替えをを保存しますか"))
        return;
        var objTBL = document.getElementById("toDoTitleTable");
        if (!objTBL)
            return;

        for (var i = 1; i < objTBL.rows.length; i++) {
            //レスポンス
            var response = {};
            //リクエスト
            let request = {
                position: i,
                ItemId: encodeURI(document.getElementById("Id" + i).value)
            };
            //ajax
            $.ajax({
                url: '/cgi/ToDoTitle/sortToDoTitle.py',
                type: "POST",
                data: JSON.stringify(request),  //object -> json
                async: true,                    //true:非同期(デフォルト), false:同期
                dataType: "json",
                success: function (data) {
                    response = data;
                    //console.log("SUCCESS");
                    //console.log(data.result);
                    //console.log(data.result2);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
                }
            });
    }
        $('#sortdata').sortable('destroy')
    }

}


function dataEdit(obj) {
    var objTR = obj.parentNode.parentNode;
    var rowId = objTR.sectionRowIndex + 1;
    if (document.getElementById("editFlg" + rowId).value == 0) {
        document.getElementById("editFlg" + rowId).value = 1
    }

}


function deleteRow(obj) {
    if (!confirm("この行を削除しますか？"))
        return;
    var objTR = obj.parentNode.parentNode;
    var objTBL = objTR.parentNode;
    var rowId = objTR.sectionRowIndex+1;
    if (!obj)
        return;

    //既にDBに登録されている場合(id項目が入っている場合)
    if (document.getElementById("Id" + rowId).value) {
        //レスポンス
        var response = {};
        //リクエスト
        let request = {
            item_id: document.getElementById("Id" + rowId).value,
        };
        //ajax
        $.ajax({
            url: '/cgi/ToDoTitle/deleteToDoTitle.py',
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
        console.log("DBDelete:"+rowId)
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


function appendRow() {
    var objTBL = document.getElementById("toDoTitleTable");
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
    c1.innerHTML = '<span class="seqno">' + String(count) + '</span>';
    c2.innerHTML = '<input type="text" class="content"  size="40" maxlength="30" id="content' + String(count) + '" value="" onchange="dataEdit(this)"></input>'
    c3.innerHTML = '<input type="checkbox" class="check" id="check' + String(count) + '" onchange="dataEdit(this)">'
    c4.innerHTML = '<input type="text" class="Id" size="3" maxlength="2" id="Id' + String(count) + '" value="">'
    c5.innerHTML = '<input type="text" class="editFlg" size="3" maxlength="2" id="editFlg' + String(count) + '" value="0">'
    c6.innerHTML = '<input type="button" class="deleteBtn" id="deleteBtn' + String(count) + '" value="削除" onclick="deleteRow(this)">';

    // 追加した行の入力フィールドへフォーカスを設定
    var objInp = document.getElementById("item" + String(count));
    if (objInp)
        objInp.focus();
}


function updateToDoList() {
    if (!confirm("変更を保存しますか"))
        return;
    var objTBL = document.getElementById("toDoTitleTable");
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
                position: i,
                content: encodeURI(document.getElementById("content" + i).value),
                status: document.getElementById("check" + i).checked,
                ItemId: encodeURI(document.getElementById("Id" + i).value)
            };
            //ajax
            $.ajax({
                url: '/cgi/ToDoTitle/registToDoTitle.py',
                type: "POST",
                data: JSON.stringify(request),  //object -> json
                async: true,                    //true:非同期(デフォルト), false:同期
                dataType: "json",
                success: function (data) {
                    response = data;
                    //console.log("SUCCESS");
                    //console.log(data.result);
                    //console.log(data.result2);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
                }
            });
        }
    }

}

