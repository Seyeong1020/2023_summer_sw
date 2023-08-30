const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ohseyeong1020.',
  database: 'login_data'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

const connectionForPosts = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ohseyeong1020.',
  database: 'posts_data'
});

connectionForPosts.connect((err) => {
  if (err) {
    console.error('MySQL connection error: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connectionForPosts.threadId);
});

// 라우팅
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/menu', (req, res) => {
  const sql = 'SELECT * FROM text';
  connectionForPosts.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error');
    }
    res.render('menu', { posts: results });
  });
});

app.get('/write', (req, res) => {
  res.render('write');
});

app.post('/write', (req, res) => {
  const { title, writer, content } = req.body;
  const sql = 'INSERT INTO text (title, writer, content) VALUES (?, ?, ?)';
  connectionForPosts.query(sql, [title, writer, content], (err, results) => {
    if (err) {
      console.error('Error creating post: ' + err.stack);
      res.status(500).send('Error creating post');
      return;
    }
    res.redirect('menu')
  });
});

app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const sql = 'SELECT * FROM text WHERE id = ?';
  connectionForPosts.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error');
    }
    res.render('post_detail', { post: results[0] });
  });
});

// 글 수정 페이지 표시
app.get('/posts/:id/edit', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (isNaN(postId)) {
    return res.status(400).send('Invalid postId');
  }
  console.log('Received postId:', postId);
  const sql = 'SELECT * FROM text WHERE id = ?';
  connectionForPosts.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error');
    }
    res.render('edit_post', { post: results[0] });
  });
});

// 글 수정 처리
app.post('/posts/:id/edit', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (isNaN(postId)) {
    return res.status(400).send('Invalid postId');
  }
  const { title, content } = req.body;
  const sql = 'UPDATE text SET title = ?, content = ? WHERE id = ?';
  connectionForPosts.query(sql, [title, content, postId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error executing query: ' + err.message);
    }
    res.redirect('/posts/' + postId);
  });
});

// 글 삭제 처리
app.post('/posts/:id/delete', (req, res) => {
  const postId = req.params.id;
  const sql = 'DELETE FROM text WHERE id = ?';
  connectionForPosts.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error');
    }
    res.redirect('/menu');
  });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error creating user: ' + err.stack);
      res.status(500).send('Error creating user');
      return;
    }
    res.send('User created successfully');
  });
});

app.post('/login', (req, res) => {
  const { loginUsername, loginPassword } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [loginUsername, loginPassword], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).send('Error');
    }
    if (results.length > 0) {
      res.redirect('/mainpage');
    } else {
      res.status(401).send('로그인 실패');
    }
  });
});

app.get('/mainpage', (req, res) => {
  res.render('mainpage(logout)');
});

app.get('/mypage', (req, res) => {
  res.render('mypage');
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다 주소 : http://localhost:${port}`);
});