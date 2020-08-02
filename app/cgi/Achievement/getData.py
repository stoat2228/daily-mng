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
    
    sql = """select * from t_achievement 
    where target_date = %s 
    order by item_id
    """
    cur.execute(sql,(target_date,))
    rows=cur.fetchall()
    achieve_flg=1
    if len(rows)==0:
        sql2 = """select * from t_settings 
        where starting_date <= %s
        and %s <= end_date 
        order by item_id """
        cur2=con.cursor()
        cur2.execute(sql2,(target_date,target_date,))
        rows=cur2.fetchall()
        achieve_flg=0
    
    responsedata = """
            <form name="fym">
            <table id="achievementTable">
                <tr>
                    <th>No</th>
                    <th>タイトル</th>
                    <th>内容</th>
                </tr>
    """

    rownumber=0
    for sqldata in rows:
        rownumber+=1
        responsedata+="""
                <tr>
                    <td><span class="seqno">"""+ str(rownumber) +"""</span></td>
                    <td><input type="text" class="item" size="20" maxlength="20" id="item"""+str(rownumber)+"""" value="""+ str(sqldata[1]) +""" onchange="dataEdit(this)"></td>
                    <td><textarea class="content" id="content"""+str(rownumber)+"""" rows="4" cols="40" maxlength="100" onchange="dataEdit(this)">"""+ str(sqldata[2]) + """</textarea></td>
                    <td hidden><input type="text" class="editFlg" size="3" readonly maxlength="2" id="editFlg"""+str(rownumber)+"""" value="""+ str(0) +"""></td>"""
        if achieve_flg:
            responsedata+="""
                    <td hidden><input type="text" class="Id" size="3" readonly maxlength="2" id="Id"""+str(rownumber)+"""" value="""+ str(sqldata[0]) +"""></td>"""
        else:
            responsedata+="""
                    <td hidden><input type="text" class="Id" size="3" readonly maxlength="2" id="Id"""+str(rownumber)+"""" value=""></td>"""
        responsedata+="""
            <td> <input type="button" class="deleteBtn" value="削除" id="deleteBtn"""+str(rownumber)+""""  onclick="deleteRow(this)"></td>
            </tr>"""
    
    responsedata+="""
            </table>
        </form>
        <input type="button" value="行追加" id="appendBtn" onclick="appendRow()">
    """

        

    cur.close()
    con.close()
    #レスポンス
    response = {"responsedata" : responsedata}

#print("Content-type: application/json")  #error
    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()