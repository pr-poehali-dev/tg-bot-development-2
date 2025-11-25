import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get sales statistics and revenue data
    Args: event with httpMethod
    Returns: Statistics with revenue, orders count, popular photos
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*), COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'paid'")
    orders_count, total_revenue = cur.fetchone()
    
    cur.execute("""
        SELECT p.title, SUM(oi.quantity) as sold_count
        FROM order_items oi
        JOIN photos p ON oi.photo_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'paid'
        GROUP BY p.title
        ORDER BY sold_count DESC
        LIMIT 5
    """)
    
    popular_photos = []
    for row in cur.fetchall():
        popular_photos.append({
            'title': row[0],
            'sold': row[1]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'total_revenue': total_revenue or 0,
            'orders_count': orders_count or 0,
            'popular_photos': popular_photos
        }),
        'isBase64Encoded': False
    }
