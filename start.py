#!/usr/bin/env python3
"""
Быстрый запуск сайта Enactus
"""

try:
    from app import app
    print("🚀 Запуск Enactus Кыргызстан сайта...")
    print("📍 Адрес: http://localhost:5000")
    print("🔧 Админ: http://localhost:5000/admin")
    print("⏹️  Остановка: Ctrl+C")
    print("-" * 40)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
    
except ImportError:
    print("❌ Flask не установлен!")
    print("💡 Установите: pip install flask")
except Exception as e:
    print(f"❌ Ошибка: {e}")