const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 8080
const path = require('path')
const mysql = require('mysql2')

var bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'views')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ohseyeong1020.',
  database: 'login_data'
})

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// 라우팅
app.get('/', (req, res) => {
  res.render('index') // ./views/index.ejs 거 출력하기
})

app.get('/login', (req, res) => {
    res.render('login')
  })
  
app.post('/signup', (req, res) => {
    const {username, password} = req.body;

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error creating user: ' + err.stack);
      res.status(500).send('Error creating user');
      return;
    }
    res.send('User created successfully');
  });
})

app.post('/login', (req, res) => {
  const { loginUsername, loginPassword } = req.body; // 수정된 필드 이름으로 

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?'; // 원래대로 SQL 쿼리 작성

  connection.query(sql, [loginUsername, loginPassword], (err, results) => { // 수정된 필드 이름으로 
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error');
    }

    if (results.length === 1) {
      // 로그인 성공
     // req.session.user = loginUsername; // 수정된 필드 이름으로 
      res.send('로그인 성공');
    } else {
      // 로그인 실패
      res.status(401).send('로그인 성공');
    }
  });
});


app.get('/mainpage', (req, res) => {
    res.render('mainpage(logout)')
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다 주소 : http://localhost:${port}`)
})