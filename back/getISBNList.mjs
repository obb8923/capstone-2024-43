import mysql from 'mysql2';
import db_config from './db-config.json' assert { type: "json" };

const connection = mysql.createConnection({
    host:db_config.host,
    user:db_config.user,
    password:db_config.password,
    database:db_config.database,
});
connection.connect();

connection.query("SELECT isbn FROM books",(err, res) => {
    for (let item of res)
        console.log(item.isbn);
    connection.destroy();
});