/*
리뷰를 클릭하면 해당 리뷰 책의 다른 리뷰를 보여준다.
클릭한 객체(리뷰)의 isbn을 DB에서 조회해 같은 isbn을 가진 리뷰들을 작성일자 기준으로 정렬해서 보여준다.
*/

function spoilerFilter(reviewData, spoilerWord) { //리뷰 텍스트, 필터링 단어
    const pattern = spoilerWord.map(word => `(${word})`).join('|'); // 필터링 단어 사이에 다른 문자가 들어가는 경우도 필터링
    const regex = new RegExp(pattern, 'gi');

    for (let i = 0; i < reviewData.length; i++) {
        reviewData[i] = reviewData[i].replace(regex, '*');
    }

    return reviewData
}

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
    let end = false;
    
    try {
        const placeholders = excludedPostIDs.map(() => '?').join(',');
        const sqlQuery = placeholders ?
            //데이터베이스에서 최근 작성된 리뷰들을 20개씩 가져옴
            `SELECT posts.*, books.author FROM posts JOIN books ON posts.isbn = books.isbn WHERE postID = '${post_id}' NOT IN (${placeholders}) ORDER BY create_at DESC LIMIT 20` :
            `SELECT posts.*, books.author FROM posts JOIN books ON posts.isbn = books.isbn WHERE postID = '${post_id}' ORDER BY create_at DESC LIMIT 20`;
        let results = await query(sqlQuery, excludedPostIDs);

        const newPostIDs = results.map(post => post.postID);
        excludedPostIDs = [...excludedPostIDs, ...newPostIDs];
        
        if (results.length != 0) {
            for (let i = 0; i < results.length; i++) {
                let spoilerWord = [];

                spoilerWord.push(results[i].title);
                spoilerWord.push(results[i].author);

                results[i].body = spoilerFilter(results[i].body, spoilerWord);
                post_obj.push(results[i]);
            }
        }
        else if (results.length == 0) {
            end = true;
        }
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }

    if (end == true) {
        let none = {
            postID: '0',
            body: 'none' ,
            UID: 0,
            status: '0',
            create_at: new Date(),
            isbn: '0',
            title: '0',
            author: '0'
        };

        post_obj.push(none);

        return post_obj;
    }

    return post_obj;
}
module.exports = {
    bookList,
};

