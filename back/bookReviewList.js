/*
리뷰를 클릭하면 해당 리뷰 책의 다른 리뷰를 보여준다.
클릭한 객체(리뷰)의 isbn을 DB에서 조회해 같은 isbn을 가진 리뷰들을 작성일자 기준으로 정렬해서 보여준다.
*/

let excludedPostIDs = [];
let post_obj = [];

async function bookList(post_id) {
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

    const query = util.promisify(connection.query).bind(connection);

    try {
        const placeholders = excludedPostIDs.map(() => '?').join(',');
        const sqlQuery = placeholders ?
            //데이터베이스에서 최근 작성된 리뷰들을 20개씩 가져옴
            `SELECT * FROM posts WHERE postID NOT IN (${placeholders}) AND postID = ? ORDER BY create_at DESC LIMIT 20` :
            `SELECT * FROM posts WHERE postID = ? ORDER BY create_at DESC LIMIT 20`;
        let results = await query(sqlQuery, excludedPostIDs);

        const newPostIDs = result2.map(post => post.postID);
        excludedPostIDs = [...excludedPostIDs, ...newPostIDs];
        
        if (results.length != 0) {
            for (let i = 0; i < results.length; i++) {
                post_obj.push(results[i]);
            }
        }
        else if (results.length == 0) {
            //DB에서 가져오는 데이터가 더 이상 없을 때 할 것
        }
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}
