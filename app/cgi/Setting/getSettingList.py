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
    target_date = params["target_date"]

    #処理
    
    con = MySQLdb.connect(
        user='root',
        passwd='passw0rd',
        host='localhost',
        db='daily_mng',
        charset='utf8'
    )
    cur=con.cursor()
    
    if target_date!="":
        sql = """select * from t_settings 
    where starting_date <= %s
    and %s <= end_date 
    order by item_id
    """
        cur.execute(sql,(target_date,target_date,))
    else:
        sql = """select * from t_settings 
    order by item_id
    """
        cur.execute(sql,)

    rows=cur.fetchall()

    cur.close()
    con.close()
    

    responsedata = """
            <form name="fym">
            <table id="settingtable">
                <tr>
                    <th>No</th>
                    <th>項目名</th>
                    <th>内容テンプレート</th>
                    <th>開始日</th>
                    <th>終了日</th>
                </tr>
                """
    rownumber=0
    for sqldata in rows:
        rownumber+=1
        responsedata+="""
                <tr>
                    <td><span class="seqno">"""+ str(rownumber) +"""</span></td>
                    <td><input type="text" class="item" size="30" readonly maxlength="20" id="item"""+str(rownumber)+"""" value="""+ str(sqldata[1]) +"""></td>
                    <td><textarea class="content" readonly id="content"""+str(rownumber)+"""" rows="3" cols="40" maxlength="200">"""+ str(sqldata[2]) + """</textarea></td>
                    <td> <input type="date" class="startingDate" readonly id="startingDate"""+str(rownumber)+"""" value="""+str(sqldata[3]) +"""></td>
                    <td> <input type="date" class="endDate" readonly id="endDate"""+str(rownumber)+"""" value="""+str(sqldata[4]) +"""></td>
                    <td hidden><input type="text" class="editFlg" size="3" readonly maxlength="2" id="editFlg"""+str(rownumber)+"""" value="""+ str(0) +"""></td>
                    <td hidden><input type="text" class="oldItemId" size="3" readonly maxlength="2" id="oldItemId"""+str(rownumber)+"""" value="""+ str(sqldata[0]) +"""></td>
                    <td> <input type="button" class="editBtn" value="編集" id="editBtn"""+str(rownumber)+"""" onclick="editRow(this)"></td>
                    <td> <input type="button" class="deleteBtn" value="削除" id="deleteBtn"""+str(rownumber)+""""  onclick="deleteRow(this)"></td>
                </tr>"""
    
    responsedata+="""
            </table>
        </form>
    """
    responsedata+="""
                    <input type="button" value="行追加" id="appendBtn" onclick="appendRow()">
                    <input type="button" value="更新" id="updateBtn" onclick="updateSettings()">
                """
    #レスポンス
    
    response = {"item_1" : responsedata }

#print("Content-type: application/json")  #error
    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()