/*
리뷰를 클릭하면 해당 리뷰 책의 다른 리뷰를 보여준다.
클릭한 객체(리뷰)의 isbn을 DB에서 조회해 같은 isbn을 가진 리뷰들을 작성일자 기준으로 정렬해서 보여준다.
*/

async function bookList() {
    //MYSQL 연결
    const mysql = require('mysql2');
    const util = require('util');
    var db_config  = require('./db-config.json');
    const connection = mysql.createConnection({
    host:db_config.host,
    user:db_config.user,
    password:db_config.password,
    database:db_config.database,
    });

    try {

        const query = '';

        connection.query(query, (error, results, fields) => {
            if (error) throw error;
            
            
            //console.log(results);
        });
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}
