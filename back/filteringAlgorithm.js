/*
연관없는 내용 - 배송 기간, 포장상태, 해택을 위한 의미없는 리뷰는 내용이 비슷하거나 짧다.
1. 특정 글자 수(50자) 미만의 리뷰들을 데이터로 사용한다. 워드임베딩 후 유사도 계산을 해서 연관없는 내용 리뷰 모델을 만든다. 이 모델을 사용해서 연관없는 내용 필터링
-> 아직 미완성

데이터베이스에서 알맞는 카테고리와 50자 이상 리뷰들을 최근 시간 기준으로 100개를 가져온다. 
*/

/*
//MYSQL 연결
const mysql = require('mysql2');
var db_config  = require('./db-config.json');
const connection = mysql.createConnection({
  host:db_config.host,
  user:db_config.user,
  password:db_config.password,
  database:db_config.database,
});
connection.connect();

connection.connect((err) => {
  if (err) {
    console.error('연결 에러: ' + err.stack);
    return;
  }
});

//50자 이상인 리뷰들만 작성 시간 순으로 가져옴
const query = 'SELECT * FROM 테이블이름 WHERE LENGTH(리뷰 데이터) >= 50 ORDER BY 작성시간 DESC LIMIT 50';

connection.query(query, (error, results, fields) => {
    if (error) throw error;

    spoilerWord = ['제목', '작가']; //스포일러 워드는 api나 데이터베이스에서 작가, 제목을 가져온다.
    const pattern = spoilerWord.map(word => `(${word})`).join('|');
    const regex = new RegExp(pattern, 'gi');

    for (let i = 0; i < results.length; i++) {
        if (results[i]['리뷰 데이터']) {
            results[i][리뷰 데이터'] = results[i]['리뷰 데이터'].replace(regex, '***');
        }
    }

    // console.log(results);
});

connection.end();
*/

// 스포일러 필터링
// 스포일러는 api에서 제목, 작가, 번역 등 가져와서 필터링 단어로 설정한다 (줄거리를 필터링해야할까?? 어려워질 거 같음)
// 스탑워드는 리스트 형태
function spoilerFilter(reviewData, spoilerWord) { //리뷰 텍스트, 필터링 단어
    const pattern = spoilerWord.map(word => `(${word})`).join('|'); // 필터링 단어 사이에 다른 문자가 들어가는 경우도 필터링
    const regex = new RegExp(pattern, 'gi');

    for (let i = 0; i < reviewData.length; i++) {
        reviewData[i] = reviewData[i].replace(regex, '*');
    }

    return reviewData
}

console.log(spoilerFilter(['안녕하세요', '반갑습니다'], ['안녕', '반갑']));