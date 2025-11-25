import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create order and save to database
    Args: event with httpMethod, body with items and email
    Returns: Order confirmation
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        items = body_data.get('items', [])
        email = body_data.get('email', '')
        
        total_amount = sum(item['price'] * item['quantity'] for item in items)
        
        cur.execute(
            "INSERT INTO orders (customer_email, total_amount, status) VALUES (%s, %s, %s) RETURNING id",
            (email, total_amount, 'paid')
        )
        order_id = cur.fetchone()[0]
        
        for item in items:
            cur.execute(
                "INSERT INTO order_items (order_id, photo_id, quantity, price) VALUES (%s, %s, %s, %s)",
                (order_id, item['photo_id'], item['quantity'], item['price'])
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'order_id': order_id,
                'total': total_amount,
                'status': 'success'
            }),
            'isBase64Encoded': False
        }
    
    elif method == 'GET':
        cur.execute("""
            SELECT o.id, o.customer_email, o.total_amount, o.status, o.created_at,
                   COUNT(oi.id) as items_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT 50
        """)
        
        orders = []
        for row in cur.fetchall():
            orders.append({
                'id': row[0],
                'email': row[1],
                'total': row[2],
                'status': row[3],
                'date': row[4].isoformat() if row[4] else None,
                'items_count': row[5]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(orders),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
