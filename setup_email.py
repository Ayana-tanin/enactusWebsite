#!/usr/bin/env python3
"""
Скрипт для настройки пароля email
Запустите: python setup_email.py
"""

import os
import sys

def setup_email_password():
    print("=== Настройка Email для Enactus KSLA ===")
    print()
    print("1. Убедитесь, что у вас включена двухфакторная аутентификация в Gmail")
    print("2. Создайте пароль приложения в настройках Google аккаунта")
    print("3. Введите пароль приложения ниже")
    print()
    
    password = input("Введите пароль приложения Gmail: ").strip()
    
    if not password:
        print("Пароль не может быть пустым!")
        return False
    
    # Читаем текущий файл app.py
    try:
        with open('app.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Заменяем пустой пароль на введенный
        old_line = "'sender_password': 'olgd jrlv ujiy mcpz',"
        new_line = f"'sender_password': '{password}',"
        
        if old_line in content:
            content = content.replace(old_line, new_line)
            
            # Записываем обратно
            with open('app.py', 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✓ Пароль успешно сохранен в app.py")
            print("✓ Теперь письма будут отправляться автоматически")
            print()
            print("Для тестирования:")
            print("1. Запустите сервер: python app.py")
            print("2. Откройте админ панель: http://localhost:5000/admin")
            print("3. Используйте функцию тестирования email")
            return True
        else:
            print("✗ Не удалось найти строку для замены в app.py")
            print("Возможно, пароль уже настроен или файл изменен")
            return False
            
    except FileNotFoundError:
        print("✗ Файл app.py не найден!")
        return False
    except Exception as e:
        print(f"✗ Ошибка: {e}")
        return False

if __name__ == "__main__":
    success = setup_email_password()
    if not success:
        sys.exit(1)