const { assert } = require('chai');
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
  printDB,
  isLoggedIn,
  urlExists,
  permissionAllowed
} = require('../helpers');
const{User} = require('../user')
const bcrypt = require('bcrypt');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlObj1 = { longURL: "https://www.tsn.ca", userID: "userId1" , counter:{}, log:{}};
const urlObj2 = { longURL: "https://www.google.ca", userID: "userId1", counter:{}, log:{}};
const urlObj3 = { longURL: "https://www.youtube.com", userID: "userId2", counter:{}, log:{}};
const urlObj4 = { longURL: "https://www.yahoo.com", userID: "userId2" , counter:{}, log:{}};
const urlObj5 = { longURL: "https://www.hotmail.com", userID: "userId3" , counter:{}, log:{}};
const urlObj6 = { longURL: "https://www.example.edu", userID: "userId3" , counter:{}, log:{}};

// user class contains id, email, password and object containing all url associated by them
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

// database of all urls
const urlDatabase ={
  b6UTxQ: urlObj1,
  i3BoGr: urlObj2,
  aaaaaa: urlObj3,
  bbbbbb: urlObj4,
  111111: urlObj5,
  222222: urlObj6
};

// user database 
const userDB = {}
addToUserDB([user1, user2, user3], userDB);

//////////////////////////////////////////////////////////////////////////
describe('addToUserDB', function() {
  it('should have new users added', function() {
    const expected = {
      userId1: user1,
      userId2: user2,
      userId3: user3
    };
    assert.deepEqual(expected, userDB);
  });

  it('should work with single user', function() {
    const newDB = {userId1: user1}
    addToUserDB(user2, newDB);
    const expected = {
      userId1: user1,
      userId2: user2
    };
    assert.deepEqual(expected, newDB);
  });
});

///////////////////////////////////////////////////////////////////////////
describe('checkValidNewUser', function() {
  it('should reutrn false when existing user id', function() {
    const actual = checkValidNewUser('userId1', 'test@email', '123', '123', userDB)
    const expected = false;
    assert.strictEqual(expected, actual);
  });

  it('should return false when existing user email', function() {
    const actual = checkValidNewUser('userId4', '1@email.com', '123', '123', userDB)
    const expected = false;
    assert.strictEqual(expected, actual);
  });

  it('should return false when password doesnt match verifying password', function() {
    const actual = checkValidNewUser('userId4', 'test@email', '123', '1223', userDB)
    const expected = false;
    assert.strictEqual(expected, actual);
  });

  it('should return true when id, email are both new and passwords match', function() {
    const actual = checkValidNewUser('userId4', 'test@email', '123', '123', userDB)
    const expected = true;
    assert.strictEqual(expected, actual);
  });
});

///////////////////////////////////////////////////////////////////////////

describe('authenticateLogin', function() {
  it('should return true with id in DB and correct pw', function() {
    const actual = authenticateLogin('userId1', '1111', userDB)
    const expected = true;
    assert.strictEqual(expected, actual);
  });

  it('should return false with id in DB and incorrect pw', function() {
    const actual = authenticateLogin('userId1', '111', userDB)
    const expected = false;
    assert.strictEqual(expected, actual);
  });

  it('should reutrn false with id not in DB', function() {
    const actual = authenticateLogin('userId11', '1111', userDB)
    const expected = false;
    assert.strictEqual(expected, actual);
  });
});

///////////////////////////////////////////////////////////////////////////

describe('urlsForUser', function() {
  it('should return abd object containing all url that corresponds to input user', function() {
    const actual = urlsForUser('userId1', userDB)
    const expected = {  
      b6UTxQ: urlObj1,
      i3BoGr: urlObj2
    };
    assert.deepEqual(expected, actual);
  });
});

///////////////////////////////////////////////////////////////////////////

describe('updateCount', function() {
  it('should create new key val pair and initialize var as 1 if userID doesnt exist as a key in urlObj.counter', function() {
    updateCount(urlObj1, 'id');
    const actual = urlObj1.counter['id'];
    const expected = 1;
    assert.strictEqual(expected, actual);
  });

  it('should increment if userID exists in counter', function() {
    urlObj1.counter['id'] = 500;
    updateCount(urlObj1, 'id');
    const actual = urlObj1.counter['id'];
    const expected = 501;
    assert.strictEqual(expected, actual);
  });

  it('should behave the same way with userID as visitor if userID is undefined', function() {
    updateCount(urlObj1, undefined);
    const actual = urlObj1.counter['visitor'];
    const expected = 1;
    assert.strictEqual(expected, actual);
  });

  it('should behave the same way with userID as visitor if userID is null', function() {
    updateCount(urlObj2, null);
    const actual = urlObj2.counter['visitor'];
    const expected = 1;
    assert.strictEqual(expected, actual);
  });
});

///////////////////////////////////////////////////////////////////////////

describe('updateLog', function() {
  it('should add to the log with key as date string and value as userID', function() {
    updateLog(urlObj3, 'id', 'date');
    const actual = urlObj3.log['date'];
    const expected = 'id';
    assert.strictEqual(expected, actual);
  });

  it('should world with null userID, replacing it with visitor', function() {
    updateLog(urlObj4, null, 'date');
    const actual = urlObj4.log['date'];
    const expected = 'visitor';
    assert.strictEqual(expected, actual);
  });

  it('should world with undefined userID, replacing it with visitor', function() {
    updateLog(urlObj5, undefined, 'date');
    const actual = urlObj5.log['date'];
    const expected = 'visitor';
    assert.strictEqual(expected, actual);
  });
});

///////////////////////////////////////////////////////////////////////////

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const actual = getUserByEmail("user@example.com", testUsers)
    const expected = "userRandomID";
    assert.deepEqual(expected, actual);
  });

  it('should return undefined with invalid email', function() {
    const actual = getUserByEmail("user@exaaample.com", testUsers)
    const expected = undefined
    assert.deepEqual(expected, actual);
  });
});
