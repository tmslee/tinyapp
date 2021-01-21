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
const user1 = new User('userId1' , '1@email.com', bcrypt.hashSync('1111', 10),{
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userId1" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userId1" }
});
const user2 = new User('userId2' , '2@email.com', bcrypt.hashSync('2222', 10));
const user3 = new User('userId3' , '3@email.com', bcrypt.hashSync('3333', 10));

const userDB = {}
addToUserDB([user1, user2, user3], userDB);

const urlDatabase ={
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userId1" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userId1" }
};

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
    req.session['userId'] = userId;
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
  const longURL = urlDatabase[shortURL].longURL;
  const user = userDB[req.session['userId']];

  const templateVars = {shortURL, longURL, user};
  res.render('urls_show', templateVars);
});


// delete url
app.delete('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const currUID = req.session['userId'];
  const urlUID = urlDatabase[shortURL].userID;

  if(currUID === urlUID){
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
    urlDatabase[shortURL].longURL = longURL;
    urlsForUser(currUID, userDB)[shortURL].longURL = longURL;
  }

  res.redirect('/urls');
});

// redirect to longURL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

/////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

//
