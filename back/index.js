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
/*const mysql = require('mysql2');
var db_config  = require('./db-config.json');
const connection = mysql.createConnection({
  host:db_config.host,
  user:db_config.user,
  password:db_config.password,
  database:db_config.database,
});
connection.connect();
*/
//8080 번 포트에서 시작하기
app.listen(8080, function () {
    console.log('Listening to port 8080')
  });
  
  //react build dir 연결
  app.use(express.static(path.join(__dirname, '/../front/build')));

  //react에서 route 사용하기 - 맨 밑에 둘 것
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/../front/build/index.html'));
  });