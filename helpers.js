const bcrypt = require('bcrypt');

const generateRandomString = function(len){
  let result = '';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for (let i = 0; i < len; i++){
    result += CHARS[Math.floor(Math.random()*62)];
  }
  return result;
};

const addToUserDB = function (users, userDB){
  if(Array.isArray(users)){
    let id;
    for(const user of users){
      id = user.id;
      userDB[id] = user;
    }
  }
  else{
    const id = users.id;
    userDB[id] = users;
  }
}

const checkValidNewUser = function (id, email, pw, vpw, userDB){
  if(!id || !email || !pw) return false;
  if(userDB[id]) return false;
  if(pw !== vpw) return false;

  for(const user in userDB){
    if(user.email === email) return false;
  }
  return true;
}

const authenticateLogin = function(id, password, userDB){
  if(userDB[id]){
    const correctPW = userDB[id].password;
    return bcrypt.compareSync(password, correctPW);
  }
  return false;
}

const createNewURLObj = function (longURL, userID){
  return {longURL, userID};
}

const urlsForUser = function (id, userDB){
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
const printDB = function (userDB, urlDatabase, req){
  console.log(userDB);
  console.log(urlDatabase);
  console.log(req.cookies['userId']);
}

const getUserByEmail = function (email, userDB) {
  for(let id in userDB){
    const user = userDB[id];
    if(user.email === email) return id; 
  }
  return undefined;
};

module.exports = {
  generateRandomString, 
  addToUserDB, 
  checkValidNewUser, 
  authenticateLogin,
  createNewURLObj,
  urlsForUser,
  getUserByEmail,
  printDB
};