import sqlite3
import uuid
from datetime import datetime

db_path = r'D:\Projeler\SCX-Studio-Pro\prisma\scx_studio.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

user_id = str(uuid.uuid4())
now = datetime.now().isoformat()

try:
    cursor.execute('''
        INSERT INTO User (id, name, email, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, 'Kaptan Yusuf', 'roxoe.yusuf.yavuz@gmail.com', 'ADMIN', now, now))
    conn.commit()
    print(f"✅ Admin user created: {user_id}")
except Exception as e:
    print(f"❌ Error: {e}")

conn.close()
