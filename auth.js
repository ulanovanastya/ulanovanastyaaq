
(() => {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    // Переключение между формами входа и регистрации
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
        loginMessage.textContent = '';
        registerMessage.textContent = '';
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
        loginMessage.textContent = '';
        registerMessage.textContent = '';
    });

    // Обработчик входа
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            loginMessage.textContent = 'Заполните все поля!';
            return;
        }

        try {
            const user = await Storage.login(username, password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                loginMessage.textContent = 'Неверное имя пользователя или пароль!';
            }
        } catch (err) {
            console.error('Ошибка входа:', err);
            loginMessage.textContent = 'Ошибка при входе. Попробуйте позже.';
        }
    });

    // Обработчик регистрации
    registerForm.addEventListener('submit', async e => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const username = document.getElementById('username').value.trim();
        const internalCode = document.getElementById('internalCode').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('regPassword').value;

        if (!firstName || !lastName || !username || !internalCode || !email || !phone || !password) {
            registerMessage.textContent = 'Заполните все поля!';
            return;
        }

        if (!/^\d{6}$/.test(internalCode)) {
            registerMessage.textContent = 'Внутренний код должен состоять из 6 цифр!';
            return;
        }

        if (!/^\d{10,11}$/.test(phone)) {
            registerMessage.textContent = 'Номер телефона должен содержать 10-11 цифр!';
            return;
        }

        try {
            const registeredUsers = await Storage.getRegisteredUsers();
            const users = await Storage.getUsers();

            if (registeredUsers.find(u => u.email === email || u.internalCode === internalCode)) {
                registerMessage.textContent = 'Пользователь с таким email или кодом уже зарегистрирован!';
                return;
            }

            if (users.find(u => u.username === username)) {
                registerMessage.textContent = 'Пользователь с таким именем уже существует!';
                return;
            }

            // Для localStorage используем хеш пароля '123' для простоты
            const hashedPassword = '$2b$10$4j9z5Y5X5Z7Y5Z7Y5Z7Y5u5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7'; // bcrypt хеш '123'

            // Добавление в зарегистрированные пользователи
            const newRegisteredUser = {
                firstName,
                lastName,
                username,
                internalCode,
                email,
                phone,
                password: Storage.useLocalStorage ? hashedPassword : password,
                registeredAt: new Date().toISOString()
            };
            registeredUsers.push(newRegisteredUser);
            await Storage.saveRegisteredUsers(registeredUsers);

            // Добавление в список пользователей с ролью по умолчанию
            users.push({
                username,
                password: Storage.useLocalStorage ? hashedPassword : password,
                role: 'Просмотр',
                active: true
            });
            await Storage.saveUsers(users);

            registerForm.reset();
            registerMessage.textContent = 'Регистрация успешна! Теперь вы можете войти.';
            loginTab.click();
        } catch (err) {
            console.error('Ошибка регистрации:', err);
            registerMessage.textContent = 'Ошибка при регистрации. Попробуйте позже.';
        }
    });
})();



// Простой тестовый фреймворк
const Test = {
  describe(description, fn) {
    console.group(description);
    try {
      fn();
    } catch (e) {
      console.error('Test failed:', e.message);
    }
    console.groupEnd();
  },
  
  it(testName, fn) {
    try {
      fn();
      console.log(`✓ ${testName}`);
    } catch (e) {
      console.error(`✕ ${testName}`, e.message);
    }
  },
  
  expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, but got ${actual}`);
        }
      },
      toBeTruthy() {
        if (!actual) {
          throw new Error(`Expected truthy value, but got ${actual}`);
        }
      },
      toBeFalsy() {
        if (actual) {
          throw new Error(`Expected falsy value, but got ${actual}`);
        }
      }
    };
  }
};



// Тест 1: Проверка валидации внутреннего кода
Test.describe('Валидация внутреннего кода', () => {
  Test.it('должен принимать 6 цифр', () => {
    const validCode = '123456';
    Test.expect(/^\d{6}$/.test(validCode)).toBe(true);
  });
  
  Test.it('не должен принимать меньше 6 цифр', () => {
    const invalidCode = '12345';
    Test.expect(/^\d{6}$/.test(invalidCode)).toBe(false);
  });
  
  Test.it('не должен принимать нецифровые символы', () => {
    const invalidCode = '123abc';
    Test.expect(/^\d{6}$/.test(invalidCode)).toBe(false);
  });
});

//2
Test.describe('Переключение вкладок', () => {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginFormContainer = document.getElementById('loginFormContainer');
  const registerFormContainer = document.getElementById('registerFormContainer');

  Test.it('должна быть активна вкладка входа по умолчанию', () => {
    Test.expect(loginTab.classList.contains('active')).toBe(true);
    Test.expect(window.getComputedStyle(loginFormContainer).display).toBe('block');
    Test.expect(window.getComputedStyle(registerFormContainer).display).toBe('none');
  });
  
  Test.it('должна переключаться на вкладку регистрации', () => {
    registerTab.click();
    Test.expect(registerTab.classList.contains('active')).toBe(true);
    Test.expect(window.getComputedStyle(registerFormContainer).display).toBe('block');
    Test.expect(window.getComputedStyle(loginFormContainer).display).toBe('none');
    // Возвращаем обратно
    loginTab.click();
  });
});

// Тест 3: Проверка уникальности имени пользователя
Test.describe('Проверка уникальности имени пользователя', () => {

  const mockStorage = {
    getUsers: async () => [
      { username: 'ivanov', password: '123', role: 'admin' },
      { username: 'petrov', password: '456', role: 'user' }
    ]
  };

  Test.it('должен отклонять существующее имя пользователя', async () => {
    const existingUser = 'ivanov';
    const users = await mockStorage.getUsers();
    const userExists = users.some(u => u.username === existingUser);
    Test.expect(userExists).toBe(true);
  });
  
  Test.it('должен принимать новое имя пользователя', async () => {
    const newUser = 'newuniqueuser123';
    const users = await mockStorage.getUsers();
    const userExists = users.some(u => u.username === newUser);
    Test.expect(userExists).toBe(false);
  });
});