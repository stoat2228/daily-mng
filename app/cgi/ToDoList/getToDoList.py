#!/Users/tatsuya/.pyenv/versions/3.8.2/bin/python3
#-*- coding: utf-8 -*-
import cgitb
import cgi
import os
import json
import sys
import io
import urllib.parse
import MySQLdb

def main():

    #文字化け対策
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    #エラーの内容をブラウザに送信
    cgitb.enable()

    #値取得
    data   = sys.stdin.read()
    params = json.loads(data)

    #
    incomplete_flg = params["incomplete_flg"]
    target_value = params["target_value"]

    #処理
    con = MySQLdb.connect(
        user='root',
        passwd='passw0rd',
        host='localhost',
        db='daily_mng',
        charset='utf8'
    )
    cur=con.cursor()
    sql=""
    if incomplete_flg:
        sql = """select * from t_todo_list
        where title_id = %s
        and status != %s
        order by position
        """
        cur.execute(sql,(target_value,incomplete_flg,))
    else:
        sql = """select * from t_todo_list
        where title_id = %s
        order by position
        """
        cur.execute(sql,(target_value,))

    rows=cur.fetchall()

    cur.close()
    con.close()
    

    responsedata = """
            <form name="fym">
            <table id="toDoListTable" class =sortable>
            <thead>
                <tr>
                    <th>No</th>
                    <th>チェック</th>
                    <th>内容</th>
                </tr>
            </thead>
            <tbody id="sortdata">
                """
    rownumber=0
    for sqldata in rows:
        rownumber+=1
        responsedata+="""
                <tr>
                    <td><span class="seqno">"""+ str(rownumber) +"""</span></td>
                    """
        if sqldata[3]==1:
            responsedata+="""
            <td><input type="checkbox" class="check" id="check"""+str(rownumber)+"""" checked onchange="dataEdit(this)"></td>"""
        else:
            responsedata+="""
            <td><input type="checkbox" class="check" id="check"""+str(rownumber)+"""" onchange="dataEdit(this)"></td>"""
        responsedata+="""
                    <td><input type="text" class="content" size="40" maxlength="30" id="content"""+str(rownumber)+"""" value="""+ str(sqldata[2]) +""" onchange="dataEdit(this)"></td>
                    <td hidden><input type="text" class="editFlg" size="3" readonly maxlength="2" id="editFlg"""+str(rownumber)+"""" value="""+ str(0) +"""></td>
                    <td hidden><input type="text" class="Id" size="3" readonly maxlength="2" id="Id"""+str(rownumber)+"""" value="""+ str(sqldata[0]) +"""></td>
                    <td> <input type="button" class="deleteBtn" value="削除" id="deleteBtn"""+str(rownumber)+""""  onclick="deleteRow(this)"></td>
                </tr>"""
    
    responsedata+="""
            </tbody>
            </table>
        </form>
    """
    responsedata+="""
                    <input type="button" value="並べ替え" id="sortableBtn" onclick="sortableSet(this)">
                    <input type="button" value="行追加" id="appendBtn" onclick="appendRow()">
                    <input type="button" value="更新" id="updateBtn" onclick="updateToDoList()">
                """
    res=""
    
    #レスポンス
    response = {"toDoList" : responsedata ,"test" : res}
    #response = {"item_1" : target_value }

#print("Content-type: application/json")  #error
    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()