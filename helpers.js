const bcrypt = require('bcrypt');

const generateRandomString = function(len) {
  let result = '';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for (let i = 0; i < len; i++) {
    result += CHARS[Math.floor(Math.random()*62)];
  }
  return result;
};

const addToUserDB = function (users, userDB) {
  if (Array.isArray(users)) {
    let id;
    for(const user of users){
      id = user.id;
      userDB[id] = user;
    }
  } else {
    const id = users.id;
    userDB[id] = users;
  }
}

const checkValidNewUser = function (id, email, pw, vpw, userDB) {
  if (!id || !email || !pw) return false;
  if (userDB[id]) return false;
  if (pw !== vpw) return false;

  for (const user in userDB) {
    if(userDB[user].email === email) return false;
  }
  return true;
}

const authenticateLogin = function(id, password, userDB) {
  if(userDB[id]){
    const correctPW = userDB[id].password;
    return bcrypt.compareSync(password, correctPW);
  }
  return false;
}

const createNewURLObj = function (longURL, userID) {
  return {longURL, userID, counter:{}, log:{}};
}

// urls for user is simplified as a simple lookup from userDB instead of filtering all of url database
const urlsForUser = function (id, userDB) {
  return userDB[id].urlDB;
}

/*
const urlsForUser = function(id, urlDB) {
  const userURL = {};
  for(const url in urlDB){
    if(urlDB[url].userID === id) userURL[url] = urlDB[url];
  }  
  return userURL;
}
*/
const printDB = function (userDB, urlDatabase, req) {
  console.log(userDB);
  console.log(urlDatabase);
  console.log(req.cookies['userId']);
}

const getUserByEmail = function (email, userDB) {
  for (let id in userDB) {
    const user = userDB[id];
    if (user.email === email) return id; 
  }
  return undefined;
};

//when non-user visists a shorturl, they are treated as 'visitor'
const updateCount = function(urlObj, userID){
  if (!userID) {
    userID = 'visitor';
  }
  
  const counter = urlObj.counter;
  if (!counter[userID]) {
    counter[userID] = 1;
  } else {
    counter[userID] ++;
  }
};

const updateLog = function(urlObj, userID, dateString){
  if(!userID){
    userID = 'visitor';
  }
  urlObj.log[dateString] = userID;
};

const isLoggedIn = function(req) {
  return req.session['userId'];
};

const urlExists = function(urlID, urlDB) {
  return urlDB[urlID];
};

const permissionAllowed = function(currentUID, premittedUID) {
  return currentUID === premittedUID;
};

module.exports = {
  generateRandomString, 
  addToUserDB, 
  checkValidNewUser, 
  authenticateLogin,
  createNewURLObj,
  urlsForUser,
  updateCount,
  updateLog,
  getUserByEmail,
  printDB,
  isLoggedIn,
  urlExists,
  permissionAllowed
};