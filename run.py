#!/usr/bin/env python3
"""
Скрипт для запуска сайта-визитки Enactus Кыргызстан
"""

import os
import sys

def check_requirements():
    """Проверяет установлены ли необходимые зависимости"""
    try:
        import flask
        print("✓ Flask установлен")
        return True
    except ImportError:
        print("✗ Flask не установлен")
        print("Установите зависимости: pip install -r requirements.txt")
        return False

def main():
    print("=== Enactus Кыргызстан - Сайт-визитка ===")
    print()
    
    if not check_requirements():
        sys.exit(1)
    
    print("Запуск сервера...")
    print("Сайт будет доступен по адресу: http://localhost:5000")
    print("Админ панель: http://localhost:5000/admin")
    print("Для остановки нажмите Ctrl+C")
    print()
    
    # Импортируем и запускаем приложение
    from app import app
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main()