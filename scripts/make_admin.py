import sqlite3
import os

db_path = r'D:\Projeler\SCX-Studio-Pro\prisma\scx_studio.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE User SET role = 'ADMIN' WHERE email = 'roxoe.yusuf.yavuz@gmail.com'")
    conn.commit()
    print(f"✅ User updated. Rows affected: {cursor.rowcount}")
    conn.close()
else:
    print("❌ DB not found")
