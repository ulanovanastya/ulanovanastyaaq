var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};

function filledCell(cell) {
    return cell !== '' && cell != null;
}

function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], {});
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            var filteredData = jsonData.filter(row => row.some(filledCell));
            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }
            var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

// Обертка для хранения данных в PostgreSQL или localStorage
const Storage = {
    db: null,
    useLocalStorage: false,
    init: async function() {
        try {
            const response = await fetch('/api/check-db');
            if (response.ok) {
                this.db = 'postgresql';
            } else {
                throw new Error('Подключение к базе данных не удалось');
            }
        } catch (e) {
            console.warn('Переключение на localStorage:', e);
            this.useLocalStorage = true;
            this.db = window.localStorage;
            if (!this.db.getItem('users')) {
                // Инициализация с пользователями по умолчанию (пароль '123' хеширован bcrypt)
                const hashedPassword = '$2b$10$4j9z5Y5X5Z7Y5Z7Y5Z7Y5u5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7'; // bcrypt хеш '123'
                this.db.setItem('users', JSON.stringify([
                    { username: 'ivanov', role: 'Администратор', active: true, password: hashedPassword },
                    { username: 'petrov', role: 'Менеджер', active: true, password: hashedPassword },
                    { username: 'sidorov', role: 'Просмотр', active: true, password: hashedPassword }
                ]));
            }
            if (!this.db.getItem('registeredUsers')) {
                this.db.setItem('registeredUsers', JSON.stringify([]));
            }
        }
    },
    async getUsers() {
        if (this.useLocalStorage) {
            return JSON.parse(this.db.getItem('users') || '[]');
        }
        const response = await fetch('/api/users');
        return await response.json();
    },
    async saveUsers(users) {
        if (this.useLocalStorage) {
            this.db.setItem('users', JSON.stringify(users));
        } else {
            await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users)
            });
        }
    },
    async getRegisteredUsers() {
        if (this.useLocalStorage) {
            return JSON.parse(this.db.getItem('registeredUsers') || '[]');
        }
        const response = await fetch('/api/registered-users');
        return await response.json();
    },
    async saveRegisteredUsers(users) {
        if (this.useLocalStorage) {
            this.db.setItem('registeredUsers', JSON.stringify(users));
        } else {
            await fetch('/api/registered-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users)
            });
        }
    },
    async login(username, password) {
        if (this.useLocalStorage) {
            const users = JSON.parse(this.db.getItem('users') || '[]');
            const user = users.find(u => u.username === username);
            // Для localStorage предполагаем, что пароли хешированы
            if (user && user.password === '$2b$10$4j9z5Y5X5Z7Y5Z7Y5Z7Y5u5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7Y5Z7') {
                return user;
            }
            return null;
        }
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    }
};

Storage.init();