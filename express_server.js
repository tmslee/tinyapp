const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req,res) => {
  res.render('urls_new');
 });

app.get('/urls/:shortURL',(req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render('urls_show', templateVars);
});

app.post('/urls', (req,res) => {
  console.log(req.body);
  res.send('ok');
})

app.listen(PORT, () => {
  console.log(`exaple app listening on port ${PORT}`);
});

//
function generateRandomString(len){
  let result = '';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for (let i = 0; i < len; i++){
    result += CHARS[Math.floor(Math.random()*62)];
  }
  return result;
}