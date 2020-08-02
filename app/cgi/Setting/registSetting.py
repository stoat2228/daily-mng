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
    item = params["item"]#url encoded
    content = params["content"]#url encoded
    startingDate = params["startingDate"]
    endDate = params["endDate"]
    oldItemId = params["oldItemId"]#url encoded

    #url decode
    item = urllib.parse.unquote(item)
    content = urllib.parse.unquote(content)   
    oldItemId = urllib.parse.unquote(oldItemId)

    #処理
    
    con = MySQLdb.connect(
        user='root',
        passwd='passw0rd',
        host='localhost',
        db='daily_mng',
        charset='utf8'
    )
    cur=con.cursor()

    if oldItemId :
        sql = """
        UPDATE t_settings set item_name = %s ,content_template = %s ,starting_date = %s , end_date = %s
        where item_id = %s ;
        """
        cur.execute(sql,(item,content,startingDate,endDate,oldItemId))
    else :
        sql2 = """
        INSERT INTO t_settings (item_name,content_template,starting_date,end_date,setting_date,setting_user)
        values(%s,%s,%s,%s,DEFAULT,%s)
        """
        cur.execute(sql2,(item,content,startingDate,endDate,1))
    #レスポンス
    response = {"result" : "SUCCESS"}

    con.commit()
    cur.close()
    con.close()

    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()