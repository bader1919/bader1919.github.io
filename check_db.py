import sqlite3
conn = sqlite3.connect('data/portfolio.db')
cursor = conn.cursor()
row = cursor.execute("SELECT slug, description_path FROM projects WHERE slug = 'home-assistant-automation-analysis'").fetchone()
print(f"Slug: {row[0]}")
print(f"Path: {row[1]}")
print(f"Path exists: {__import__('pathlib').Path(row[1]).exists()}")
