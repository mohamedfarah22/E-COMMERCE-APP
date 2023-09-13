const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy;
const pool = new Pool({
    user:"admin",
    password: "ecommdb",
    host: "ecomm-database-postgres",
    database: "ecommercedatabase",
    port: 5432
});
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

const createUser = async (req, res) => {
    const {first_name, last_name, email, password} = req.body
   
   

    //hash password before inserting into database and add 3 salts
    const hashedPassword = await passwordHash(password, 3)

    //insert new user in database with hashed password

    pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, hashedPassword], (error, results) => {
        if(error){
            throw error
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
    
}

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
    createUser, 
    comparePasswords
}