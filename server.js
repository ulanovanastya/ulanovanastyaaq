const express = require('express')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const app = express()
const port = 3000

// Настройка подключения к базе данных
const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'submicron_db',
  password: 'password',
  port: 5432
});

// Включение обработки JSON
app.use(express.json())

// Проверка соединения с БД
app.get('/ping', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.send('База данных работает')
  } catch {
    res.status(500).send('Ошибка базы данных')
  }
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.status(400).send('Нужны имя пользователя и пароль')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query(
      'INSERT INTO users(username, password) VALUES($1, $2)',
      [username, hashedPassword]
    );
    res.send('Пользователь создан')
  } catch (err) {
    res.status(500).send('Ошибка регистрации')
  }
});

// Вход пользователя
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const user = result.rows[0]
    if (!user) return res.status(401).send('Неверные данные')
    
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).send('Неверные данные')
    
    res.send(`Добро пожаловать, ${username}!`)
  } catch (err) {
    res.status(500).send('Ошибка входа')
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`)
});