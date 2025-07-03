// Исходный код приложения
(() => {
    const userForm = document.getElementById('userForm');
    const formMessage = document.getElementById('formMessage');
    const usersTableBody = document.querySelector('#usersTable tbody');

    // Мок Storage для демонстрации (в реальном приложении это будет отдельный модуль)
    const Storage = {
        users: [
            { username: 'admin', password: 'admin', role: 'Админ', active: true },
            { username: 'manager', password: '123', role: 'Менеджер', active: false }
        ],
        
        async getUsers() {
            return this.users;
        },
        
        async saveUsers(users) {
            this.users = users;
            return true;
        }
    };

    async function renderUsers() {
        try {
            usersTableBody.innerHTML = '';
            const users = await Storage.getUsers();
            users.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.active ? 'Активен' : 'Неактивен'}</td>
                    <td>
                        <button class="toggleStatus" data-index="${index}">Переключить статус</button>
                        <button class="deleteUser" data-index="${index}">Удалить</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });

            // Привязка событий к кнопкам
            document.querySelectorAll('.toggleStatus').forEach(button => {
                button.addEventListener('click', async () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    await toggleUser(index);
                });
            });

            document.querySelectorAll('.deleteUser').forEach(button => {
                button.addEventListener('click', async () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    await deleteUser(index);
                });
            });
        } catch (err) {
            console.error('Ошибка рендеринга пользователей:', err);
            formMessage.textContent = 'Ошибка загрузки пользователей.';
        }
    }

    async function toggleUser(index) {
        try {
            const users = await Storage.getUsers();
            if (index >= users.length) {
                formMessage.textContent = 'Пользователь не найден!';
                return;
            }
            users[index].active = !users[index].active;
            await Storage.saveUsers(users);
            formMessage.textContent = `Статус пользователя ${users[index].username} изменен на ${users[index].active ? 'Активен' : 'Неактивен'}.`;
            await renderUsers();
        } catch (err) {
            console.error('Ошибка переключения статуса:', err);
            formMessage.textContent = 'Ошибка при изменении статуса.';
        }
    }

    async function deleteUser(index) {
        try {
            const users = await Storage.getUsers();
            if (index >= users.length) {
                formMessage.textContent = 'Пользователь не найден!';
                return;
            }
            const username = users[index].username;
            if (confirm(`Удалить пользователя "${username}"?`)) {
                users.splice(index, 1);
                await Storage.saveUsers(users);
                formMessage.textContent = `Пользователь ${username} удален.`;
                await renderUsers();
            }
        } catch (err) {
            console.error('Ошибка удаления пользователя:', err);
            formMessage.textContent = 'Ошибка при удалении пользователя.';
        }
    }

    userForm.addEventListener('submit', async e => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!username || !password || !role) {
            formMessage.textContent = 'Заполните все поля!';
            return;
        }

        try {
            const users = await Storage.getUsers();
            if (users.find(u => u.username === username)) {
                formMessage.textContent = 'Пользователь уже существует!';
                return;
            }

            users.push({ username, role, active: true, password });
            await Storage.saveUsers(users);
            await renderUsers();
            userForm.reset();
            formMessage.textContent = 'Пользователь добавлен!';
        } catch (err) {
            console.error('Ошибка добавления пользователя:', err);
            formMessage.textContent = 'Ошибка при добавлении пользователя.';
        }
    });

    // Инициализация
    renderUsers();
})();

// Тестовый фреймворк
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
      },
      toMatch(regex) {
        if (!regex.test(actual)) {
          throw new Error(`Expected ${actual} to match ${regex}`);
        }
      }
    };
  }
};

// Юнит-тесты
Test.describe('Добавление пользователя', () => {
  Test.it('должен добавлять пользователя в таблицу', async () => {
    const initialRowCount = document.querySelectorAll('#usersTable tbody tr').length;
    document.getElementById('username').value = 'testuser';
    document.getElementById('password').value = 'testpass';
    document.getElementById('role').value = 'Менеджер';
    document.getElementById('userForm').dispatchEvent(new Event('submit'));
    await new Promise(resolve => setTimeout(resolve, 50));
    const newRowCount = document.querySelectorAll('#usersTable tbody tr').length;
    Test.expect(newRowCount).toBe(initialRowCount + 1);
  });
});

Test.describe('Валидация формы', () => {
  Test.it('должен показывать ошибку при пустых полях', () => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('role').value = '';
    document.getElementById('userForm').dispatchEvent(new Event('submit'));
    Test.expect(document.getElementById('formMessage').textContent).toBe('Заполните все поля!');
  });
  
  Test.it('должен показывать ошибку при существующем пользователе', async () => {
    document.getElementById('username').value = 'admin';
    document.getElementById('password').value = 'testpass';
    document.getElementById('role').value = 'Менеджер';
    document.getElementById('userForm').dispatchEvent(new Event('submit'));
    
    await new Promise(resolve => setTimeout(resolve, 50));
    Test.expect(document.getElementById('formMessage').textContent).toBe('Пользователь уже существует!');
  });
});

Test.describe('Переключение статуса пользователя', () => {
  Test.it('должен изменять статус пользователя', async () => {
    const toggleButton = document.querySelector('#usersTable tbody tr:first-child .toggleStatus');
    const initialStatus = document.querySelector('#usersTable tbody tr:first-child td:nth-child(3)').textContent;
    
    toggleButton.click();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const newStatus = document.querySelector('#usersTable tbody tr:first-child td:nth-child(3)').textContent;
    Test.expect(newStatus).not.toBe(initialStatus);
  });
});

Test.describe('Удаление пользователя', () => {
  Test.it('должен удалять пользователя из таблицы', async () => {
    const initialRowCount = document.querySelectorAll('#usersTable tbody tr').length;
    const deleteButton = document.querySelector('#usersTable tbody tr:first-child .deleteUser');
    const originalConfirm = window.confirm;
    window.confirm = () => true;
    deleteButton.click();
    await new Promise(resolve => setTimeout(resolve, 50));
    window.confirm = originalConfirm;
    const newRowCount = document.querySelectorAll('#usersTable tbody tr').length;
    Test.expect(newRowCount).toBe(initialRowCount - 1);
  });
});


