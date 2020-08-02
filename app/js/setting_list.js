
document.getElementById("search").addEventListener('click', function () {
    //レスポンス
    var response = {};
    //リクエスト
    let request = {
        target_date: document.getElementById("targetDate").value
    };
    //ajax
    $.ajax({
        url: '/cgi/Setting/getSettingList.py',
        type: "POST",
        data: JSON.stringify(request),  //object -> json
        async: true,                    //true:非同期(デフォルト), false:同期
        dataType: "json",
        success: function (data) {
            response = data;
            document.getElementById("list").innerHTML = response.item_1;

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
        }
    });
    
}, false);


function editRow(obj){
    var objTR = obj.parentNode.parentNode;
    var rowId = objTR.sectionRowIndex;
    var objInp = document.getElementById("item" + rowId);
    var objBtn = document.getElementById("editBtn" + rowId);
    if(objBtn.value=="編集"){
        objInp.readOnly = false;
        document.getElementById("content" + rowId).readOnly = false;
        document.getElementById("startingDate" + rowId).readOnly = false;
        document.getElementById("endDate" + rowId).readOnly = false;
        objInp.focus();
        objBtn.value = "確定";

    }
    else{
        objInp.readOnly = true;
        document.getElementById("content" + rowId).readOnly = true;
        document.getElementById("startingDate" + rowId).readOnly = true;
        document.getElementById("endDate" + rowId).readOnly = true;
        document.getElementById("editFlg" + rowId).value = 1;
        objBtn.value = "編集"
    }
    
}

function appendRow(){
    var objTBL = document.getElementById("settingtable");
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
    var c7 = row.insertCell(6);
    var c8 = row.insertCell(7);
    var c9 = row.insertCell(8);

    // 各列にスタイルを設定
    c6.style.cssText = 'display: none;';
    c7.style.cssText = 'display: none;';
    
    // 各列に表示内容を設定
    c1.innerHTML = '<span>' + count + '</span>';
    c2.innerHTML = '<input type="text" class="item" size="30" maxlength="20" id="item'+count+'" value="">'
    c3.innerHTML = '<textarea class="content" id="content'+count+'" rows="3" cols="40" maxlength="200"></textarea>'
    c4.innerHTML = '<input type="date" class="startingDate" id="startingDate'+count+'" value="">';
    c5.innerHTML = '<input type="date" class="endDate" id="endDate'+count+'" value="">';
    c6.innerHTML = '<input type="text" class="editFlg" size="3" maxlength="2" id="editFlg'+count+'" value="0">'
    c7.innerHTML = '<input type="text" class="oldItemId" size="3" maxlength="2" id="oldItemId'+count+'" value="">'
    c8.innerHTML = '<input type="button" class="editBtn" id="editBtn' + count + '" value="確定" onclick="editRow(this)">';
    c9.innerHTML = '<input type="button" class="deleteBtn" id="deleteBtn' + count + '" value="削除" onclick="deleteRow(this)">';
    
    // 追加した行の入力フィールドへフォーカスを設定
    var objInp = document.getElementById("item" + count);
    if (objInp)
        objInp.focus();
    
}

function deleteRow(obj){
    if (!confirm("この行を削除しますか？"))
        return;
    var objTR = obj.parentNode.parentNode;
    var objTBL = objTR.parentNode;
    var rowId = objTR.sectionRowIndex;
    if (!obj)
        return;

    //既にDBに登録されている場合(old項目が入っている場合)
    if(document.getElementById("oldItemId"+rowId).value){
        //レスポンス
        var response = {};
        //リクエスト
        let request = {
            item_id: document.getElementById("oldItemId"+rowId).value,
        };
        //ajax
        $.ajax({
            url: '/cgi/Setting/deleteSetting.py',
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
    }

    if (objTBL)
        objTBL.deleteRow(objTR.sectionRowIndex);
    
        // <span> 行番号ふり直し
    var tagElements = document.getElementsByTagName("span");
    if (!tagElements)
        return false;

    var seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("seqno"))
            tagElements[i].innerHTML = seq++;
    }

    // id ふり直し
    var tagElements = document.getElementsByTagName("input");
    if (!tagElements)
        return false;

    // <input type="text" id="item">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("item"))
        {
            tagElements[i].setAttribute("id", "item" + seq);
             ++seq;
        }
    }

    // <input type="date" id="startingDate">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("startingDate"))
        {
            tagElements[i].setAttribute("id", "startingDate" + seq);
            ++seq;
        }
    }

    // <input type="date" id="endDate">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("endDate"))
        {
            tagElements[i].setAttribute("id", "endDate" + seq);
            ++seq;
        }
    }

    // <input type="text" id="editFlg">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("editFlg"))
        {
            tagElements[i].setAttribute("id", "editFlg" + seq);
            ++seq;
        }
    }

    // <input type="text" id="oldItemId">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("oldItemId"))
        {
            tagElements[i].setAttribute("id", "oldItemId" + seq);
            ++seq;
        }
    }

    // <input type="date" id="oldStartingDate">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("oldStartingDate"))
        {
            tagElements[i].setAttribute("id", "oldStartingDate" + seq);
            ++seq;
        }
    }

    // <input type="date" id="oldEndDate">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("oldEndDate"))
        {
            tagElements[i].setAttribute("id", "oldEndDate" + seq);
            ++seq;
        }
    }

    
    // <input type="button" id="editBtn">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("editBtn"))
        {
            tagElements[i].setAttribute("id", "editBtn" + seq);
            ++seq;
        }
    }

    // <input type="button" id="deleteBtn">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("deleteBtn"))
        {
            tagElements[i].setAttribute("id", "deleteBtn" + seq);
            ++seq;
        }
    }

    // id ふり直し
    var tagElements = document.getElementsByTagName("textarea");
    if (!tagElements)
        return false;

    // <"textarea" id="content">
    seq = 1;
    for (var i = 0; i < tagElements.length; i++)
    {
        if (tagElements[i].className.match("content"))
        {
            tagElements[i].setAttribute("id", "content" + seq);
             ++seq;
        }
    }

    /*
    var rowId = objTR.sectionRowIndex;
    var objInp = document.getElementById("item" + rowId);
    var objBtn = document.getElementById("editBtn" + rowId);
    console.log(rowId)
    */
    
}


function updateSettings(){
    if (!confirm("変更を保存しますか"))
        return;
    var objTBL = document.getElementById("settingtable");
    if (!objTBL)
        return;

    for (var i = 1; i < objTBL.rows.length; i++)
    {
        var updateFlg = document.getElementById("editFlg" + i);
        //更新or追加対象
        if(updateFlg.value==1){
            //レスポンス
            var response = {};
            //リクエスト
            let request = {
                item : encodeURI(document.getElementById("item" + i).value),
                content : encodeURI(document.getElementById("content" + i).value),
                startingDate : document.getElementById("startingDate" + i).value,
                endDate : document.getElementById("endDate" + i).value,
                oldItemId : encodeURI(document.getElementById("oldItemId" + i).value)
            };
            //ajax
            $.ajax({
                url: '/cgi/Setting/registSetting.py',
                type: "POST",
                data: JSON.stringify(request),  //object -> json
                async: true,                    //true:非同期(デフォルト), false:同期
                dataType: "json",
                success: function (data) {
                    //console.log(data.result);
                    //console.log("SUCCESS")
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("リクエスト時になんらかのエラーが発生しました\n" + "\n" + textStatus + ":\n" + errorThrown);
                }
            });
        }
    }
    /*
    var rowId = objTR.sectionRowIndex;
    var objInp = document.getElementById("item" + rowId);
    var objBtn = document.getElementById("editBtn" + rowId);
    console.log(rowId)
    */
    
}