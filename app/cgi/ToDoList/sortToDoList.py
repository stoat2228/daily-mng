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
    position = params["position"]
    ItemId = params["ItemId"]#url encoded

    #url decode
    ItemId = urllib.parse.unquote(ItemId)
    
    #処理
    
    con = MySQLdb.connect(
        user='root',
        passwd='passw0rd',
        host='localhost',
        db='daily_mng',
        charset='utf8'
    )
    cur=con.cursor()

    if ItemId :
        sql = """
        UPDATE t_todo_list set position = %s
        where id = %s ;
        """
        cur.execute(sql,(position,ItemId))

    con.commit()
    cur.close()
    con.close()

    #レスポンス
    response = {"result" : "SUCCESS"}

    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()