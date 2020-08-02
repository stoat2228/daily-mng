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

    #処理
    
    con = MySQLdb.connect(
        user='root',
        passwd='passw0rd',
        host='localhost',
        db='daily_mng',
        charset='utf8'
    )
    cur=con.cursor()
    
    sql = """select * from t_todo_title where disable = false order by position
    """
    cur.execute(sql,)

    rows=cur.fetchall()

    cur.close()
    con.close()
    

    responsedata = """
    <select name="title" id="title" onchange="titleChange()">
    <option value=""></option>"""

    rownumber=0
    for sqldata in rows:
        responsedata+="""
                <option value="""+ str(sqldata[0]) +""">""" + str(sqldata[1]) +"""</option>"""
    responsedata+="""
        </select>
    """

    #レスポンス
    response = {"titleList" : responsedata }

#print("Content-type: application/json")  #error
    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()