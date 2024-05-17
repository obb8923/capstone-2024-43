import { requestAladin } from "./bookAPI/aladin.js";
import mysql from 'mysql2';
import db_config from './db-config.json' assert { type: "json" };

const connection = mysql.createConnection({
    host:db_config.host,
    user:db_config.user,
    password:db_config.password,
    database:db_config.database,
});
connection.connect();

(async () => {
    requestAladin("search", "삼체").then(res => {
        for (let book of res.item) {
            console.log(`${book.isbn13}\t${book.title}\t${book.publisher}\t${book.author}\t${book.link}`);
            connection.query(
                `INSERT IGNORE INTO books (isbn, name, publisher, author, url)
                VALUES ("${book.isbn13}", "${book.title}", "${book.publisher}", "${book.author}", "${book.link}");`
            )
        }
    });
})();