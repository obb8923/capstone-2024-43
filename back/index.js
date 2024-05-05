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

//모든 요청의 URL과 메소드를 출력
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// /api/data 로 posts table 내용 보내기
app.get('/api/ScrollView', (req, res) => {
  let query ='SELECT ROW_NUMBER() OVER (ORDER BY DATEDIFF(CURDATE(), create_at) + postID) AS "index",DATEDIFF(CURDATE(), create_at) + postID AS weight,postID,body,UID,status,create_at,isbn FROM posts ORDER BY weight;';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: '데이터베이스에서 데이터를 가져오는 중 오류가 발생했습니다.' });
    } else {
      //console.log(results);
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

app.post('/api/signIn', (req, res) => {
  const {id,password} = req.body;
  console.log('Received data:', req.body);
  connection.query('SELECT * FROM users WHERE mail=? and password=? ',[id,password],(error,result)=>{
    if(error){
      res.status(500).json({ error: '데이터베이스에서 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
    if(result.length==0){// signIn 실패
      res.status(401).json({ error: '잘못된 사용자 ID 또는 비밀번호', isUserExist: false });
    }
    else{//SignIn성공    
      res.json({isUserExist:true});
    }
  });
});




  //react에서 route 사용하기 - 맨 밑에 둘 것
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../front/build/index.html'));
});