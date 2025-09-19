// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

function openMobileMenu() {
    mobileMenu.style.display = 'block';
    setTimeout(() => {
        mobileMenu.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    setTimeout(() => {
        mobileMenu.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);

// Закрытие меню при клике на фон
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработка формы заявки
const applicationForm = document.getElementById('applicationForm');
const formMessage = document.getElementById('formMessage');

applicationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('applicantName');
    const phoneInput = document.getElementById('applicantPhone');
    const emailInput = document.getElementById('applicantEmail');
    const submitBtn = applicationForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!name || !phone || !email) {
        showMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Валидация email
    if (!isValidEmail(email)) {
        showMessage('Введите корректный email адрес', 'error');
        return;
    }
    
    // Показываем состояние загрузки
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message, 'success');
            applicationForm.reset();
            // Сбрасываем счетчики
            updateAllCounters();
            // Обновляем статистику
            loadStats();
        } else {
            showMessage(data.message, 'error');
        }
        
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        showMessage('Произошла ошибка. Попробуйте позже.', 'error');
    } finally {
        // Возвращаем кнопку в исходное состояние
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Загрузка статистики
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        // Проверяем, существуют ли элементы перед обновлением
        const membersCount = document.getElementById('membersCount');
        const projectsCount = document.getElementById('projectsCount');
        const applicationsCount = document.getElementById('applicationsCount');
        
        if (membersCount) membersCount.textContent = data.members + '+';
        if (projectsCount) projectsCount.textContent = data.projects;
        if (applicationsCount) applicationsCount.textContent = data.total_applications;
        
    } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
    }
}

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к проектам и карточкам
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем статистику при загрузке страницы (только если элементы существуют)
    if (document.getElementById('membersCount') || 
        document.getElementById('projectsCount') || 
        document.getElementById('applicationsCount')) {
        loadStats();
    }
    
    // Настраиваем анимации
    const animatedElements = document.querySelectorAll('.project, .small-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация телефона (простая)
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Улучшенная валидация контакта
function validateContact(contact) {
    return isValidEmail(contact) || isValidPhone(contact);
}

// Валидация полей в реальном времени
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('applicantEmail');
    const phoneInput = document.getElementById('applicantPhone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                this.style.borderColor = 'var(--red-500)';
                showMessage('Введите корректный email адрес', 'error');
            } else {
                this.style.borderColor = '';
                if (formMessage.classList.contains('error')) {
                    formMessage.style.display = 'none';
                }
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone && !isValidPhone(phone)) {
                this.style.borderColor = 'var(--red-500)';
                showMessage('Введите корректный номер телефона', 'error');
            } else {
                this.style.borderColor = '';
                if (formMessage.classList.contains('error')) {
                    formMessage.style.display = 'none';
                }
            }
        });
    }
});

// Счетчик символов для полей ввода
function updateCharacterCounter(inputId, counterId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    
    if (!input || !counter) return;
    
    function updateCounter() {
        const currentLength = input.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.8) {
            counter.style.color = 'var(--red-500)';
        } else {
            counter.style.color = 'var(--muted)';
        }
    }
    
    input.addEventListener('input', updateCounter);
    updateCounter();
}

// Функция для обновления всех счетчиков
function updateAllCounters() {
    updateCharacterCounter('applicantName', 'nameCounter', 50);
    updateCharacterCounter('applicantPhone', 'phoneCounter', 20);
    updateCharacterCounter('applicantEmail', 'emailCounter', 100);
}

// Применяем счетчики к полям формы
document.addEventListener('DOMContentLoaded', () => {
    updateAllCounters();
});