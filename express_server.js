const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const {User} = require('./user');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

const {
  generateRandomString, 
  addToUserDB, 
  checkValidNewUser,
  authenticateLogin,
  createNewURLObj,
  urlsForUser,
  updateCount,
  updateLog,
  getUserByEmail,
  printDB
} = require('./helpers');

const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  keys:['userId']
}));
app.use(methodOverride('_method'));

////////////////////////////////////////////////////////////////////////////
const urlObj1 = { longURL: "https://www.tsn.ca", userID: "userId1" , counter:{}, log:{}};
const urlObj2 = { longURL: "https://www.google.ca", userID: "userId1", counter:{}, log:{}};
const urlObj3 = { longURL: "https://www.youtube.com", userID: "userId2", counter:{}, log:{}};
const urlObj4 = { longURL: "https://www.yahoo.com", userID: "userId2" , counter:{}, log:{}};
const urlObj5 = { longURL: "https://www.hotmail.com", userID: "userId3" , counter:{}, log:{}};
const urlObj6 = { longURL: "https://www.example.edu", userID: "userId3" , counter:{}, log:{}};

const user1 = new User('userId1' , '1@email.com', bcrypt.hashSync('1111', 10),{
  b6UTxQ: urlObj1,
  i3BoGr: urlObj2
});
const user2 = new User('userId2' , '2@email.com', bcrypt.hashSync('2222', 10),{
  aaaaaa: urlObj3,
  bbbbbb: urlObj4
});
const user3 = new User('userId3' , '3@email.com', bcrypt.hashSync('3333', 10),{
  111111: urlObj5,
  222222: urlObj6
});

const urlDatabase ={
  b6UTxQ: urlObj1,
  i3BoGr: urlObj2,
  aaaaaa: urlObj3,
  bbbbbb: urlObj4,
  111111: urlObj5,
  222222: urlObj6
};

const userDB = {}
addToUserDB([user1, user2, user3], userDB);

///////////////////////////////////////////////
///////////////ROUTES //////////////////////////
//home
app.get('/', (req, res) => {
  res.redirect('/urls');
});

////////////////////////////////////////////////////////////////////////
// USER AUTH///////////////////////////////////////////////////////////

// login and logout
app.get('/login', (req,res) => {
  const templateVars = {
    user: userDB[req.session['userId']],
  };
  res.render('login', templateVars);
});

app.put('/login', (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  if (authenticateLogin(userId, password, userDB)) {
    req.session['userId'] = userId;
  }
  res.redirect('/urls');
});

app.put('/logout', (req, res) => {
  req.session['userId'] = null;
  res.redirect('/urls');
});

// register page
app.get('/register', (req,res) => {
  const templateVars = {
    user: userDB[req.session['userId']]
  };
  res.render('register', templateVars);
});

// register acc
app.post('/register', (req,res) => {
  const {newId, newEmail, newPassword, verPassword} = req.body;
  
  if(checkValidNewUser(newId, newEmail, newPassword, verPassword, userDB)){
    const hashedPW = bcrypt.hashSync(newPassword, 10);
    userDB[newId] = new User(newId, newEmail, hashedPW);
    req.session['userId'] = newId;
    res.redirect('/urls');
  }
  else{
    res.status(404).send('incorrect registration parameters');
  } 
});

////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// display all created url
app.get('/urls', (req, res) => {
  const uID = req.session['userId'];
  if (!uID) res.redirect('/login');  
  else {
    const templateVars = {
      urls: urlsForUser(uID, userDB), 
      user: userDB[uID]
    };
    res.render('urls_index', templateVars);
  }
});

// create new url
app.post('/urls_new', (req,res) => {
  let shortURL = '';
  while(!shortURL || urlDatabase[shortURL]) shortURL = generateRandomString(6);

  const longURL = req.body.longURL;
  const uID = req.session['userId'];

  newURLObj = createNewURLObj(longURL, uID);
  urlDatabase[shortURL] = newURLObj;
  urlsForUser(uID, userDB)[shortURL] = newURLObj;

  res.redirect(`/urls/${shortURL}`);
});

// get create new url page
app.get('/urls/new', (req,res) => {
  const uID = req.session['userId'];
  if(uID){
    const templateVars = { 
      user: userDB[uID]
    };
    res.render('urls_new', templateVars);
  } else{
    res.redirect('/login');
  }
 });

 // show a url
app.get('/urls/:shortURL',(req, res) => {
  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL];
  const user = userDB[req.session['userId']];
  const longURL = urlObj.longURL;
  
  const counter = urlObj.counter;
  const log = urlObj.log;

  const templateVars = {shortURL, longURL, user, counter, log};
  res.render('urls_show', templateVars);
});


// delete url
app.delete('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const currUID = req.session['userId'];
  const urlUID = urlDatabase[shortURL].userID;

  if(currUID === urlUID){
    // need to delete urlobj from both userDB and urlDB
    delete urlDatabase[shortURL];
    delete urlsForUser(currUID, userDB)[shortURL];
  }
  
  res.redirect('/urls');
});

// edit url
app.put('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const currUID = req.session['userId'];
  const urlUID = urlDatabase[shortURL].userID;

  if(currUID === urlUID){ 
    //the url object in both userDB and urlDB are referencing the identical object; no need to update both
    urlDatabase[shortURL].longURL = longURL;
  }

  res.redirect('/urls');
});

// redirect to longURL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  const currUID = req.session['userId'];
  const urlObj = urlDatabase[shortURL];
  const currDate = new Date();
  const date = currDate.toLocaleString();

  updateCount(urlObj, currUID);
  updateLog(urlObj, currUID, date);
  res.redirect(longURL);
});

/////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

//
