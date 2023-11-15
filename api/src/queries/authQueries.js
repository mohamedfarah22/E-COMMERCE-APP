
const bcrypt = require('bcryptjs')

//password hashing function
const passwordHash = async (password, saltRounds) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      console.log(err);
    }
    return null;
  };


//register a new user


//password comparison logic using bcrypt.js
const comparePasswords = async (password, hash) => {
    try {
        const matchFound = await bcrypt.compare(password, hash)
        return matchFound
    } catch (err) {
        console.log(err)
    }

    return false
};






module.exports = {
    passwordHash, 
    comparePasswords
}