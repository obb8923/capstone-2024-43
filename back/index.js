//
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());//post요청 body parser

//클라이언트에서 서버로의 HTTP 요청이 서로 다른 출처에서 오더라도 정상적으로 처리
const cors = require('cors');
app.use(cors()) // cors() middleware 사용

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

//8080 번 포트에서 시작하기
app.listen(8080, function () {
    console.log('Listening to port 8080')
  });
  
//react build dir 연결
app.use(express.static(path.join(__dirname, '/../front/build')));

// /api/data 로 users table 내용 보내기
app.get('/api/ScrollView', (req, res) => {
  connection.query('SELECT * FROM posts', (error, results) => {
    if (error) {
      res.status(500).json({ error: '데이터베이스에서 데이터를 가져오는 중 오류가 발생했습니다.' });
    } else {
      res.json(results);
    }
  });
});

// /api/post/{postid} 로 post 정보 보내기
app.get('/api/post/:postId',(req,res)=>{
  const postId = req.params.postId;
  connection.query('SELECT * FROM posts WHERE postID=?',[postId],(error,result)=>{
    if(error){
      res.status(500).json({ error: '데이터베이스에서 데이터를 가져오는 중 오류가 발생했습니다.' });
    }else{
      res.json(result);
    }
  });
});
app.post('/api/filter', (req, res) => {
  const filter = req.body;
  console.log('Received filter:', req.body);

  // 예시 응답
  res.json({ status: 'success', message: `Filter received: ${filter}` });
});
  //react에서 route 사용하기 - 맨 밑에 둘 것
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../front/build/index.html'));
});