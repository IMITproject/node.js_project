// Подключение модуля Sqlite 
var sqlite3 = require('sqlite3');

// Создание объекта для работы с базой данных
var db = new sqlite3.Database(
    './db/database.db', // file_data.db — имя файла базы данных
    sqlite3.OPEN_READWRITE, // указываем, что можно получать и записывать данные 
    (err) => { // в случае возникновения ошибки будет выведено сообщение о проблеме в терминал 
        if (err) {
            console.error(err.message); 
        }
    }
);

// Экспорт объекта db
module.exports = db;