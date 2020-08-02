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
    number = params["number"]
    item = params["item"]
    content = params["content"]  #url encoded
    ItemId = params["ItemId"]

    #url decode
    item = urllib.parse.unquote(item)   
    content = urllib.parse.unquote(content)

    #処理
    con = MySQLdb.connect(
        user='root',
        passwd='passw0rd',
        host='localhost',
        db='daily_mng',
        charset='utf8'
    )
    cur=con.cursor()
    
    sql = """insert into t_achievement
    values(%s,%s,%s,%s,DEFAULT,%s) 
    on duplicate key update
    item_name=%s,
    content=%s
    """
    if ItemId:
        cur.execute(sql,(ItemId,item,content,target_date,1,item,content,))
    else:
        cur.execute(sql,(number,item,content,target_date,1,item,content,))

    con.commit()
    cur.close()
    con.close()
    #レスポンス
    response = {"res" : target_date}

    print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
    print("\n\n")
    print(json.JSONEncoder().encode(response))
    print('\n')
    

if __name__ == '__main__':
    main()