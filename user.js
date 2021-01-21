class User {
  constructor(id, email, password, urlDB){
    this._id = id;
    this._email = email;
    this._password = password;
    this._urlDB = urlDB||{};
  }

  //getters
  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get urlDB() {
    return this._urlDB;
  }

  //setters
  set id(newId) {
    this._id = newId;
  }
  set email(newEmail) {
    this._email = newEmail;
  }
  set password(newPassword) {
    this._password = newPassword;
  }
  set urlDB(newDB) {
    this._urlDB = newDB;
  }
  
  //urlDB editor
  addChangeURL(shortURL, longURL){
    this._urlDB[shortURL].longURL = longURL;
  }
  deleteURL(shortURL) {
    delete this._urlDB[shortURL];
  }
}

module.exports = {User};