const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const router = express.Router();
const db = require('../queries/authQueries')
const dbUsers = require('../queries/userQueries')
const passport = require('passport');





module.exports = (pool) => {

    //login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async function( email, password, done){
    pool.query('SELECT * FROM users WHERE email = $1', [email], async function(error, results){
        if (error) {
            return(done(error))
        }

        if(results.rows.length === 0){
            
            
            return done(null, false, {message: 'Incorrect email or password'})
        }

        const user = results.rows[0]

        const passwordAuthenticated = await db.comparePasswords(password, user.password)

        if(passwordAuthenticated){
            return done(null, user)
        }
        else{
            return done(null, false, {message: 'Incorrect password. '})
        }

    });

})
)

    router.post('/register', async (req, res, next) => {
        const {first_name, last_name, email, password} = req.body
   
   

    //hash password before inserting into database and add 3 salts
    const hashedPassword = await db.passwordHash(password, 3)

    //insert new user in database with hashed password

    pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, hashedPassword], (error, results) => {
        if (error) {
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({email : results.rows[0].email})
    })
    
    })
    router.post('/login', passport.authenticate('local'), (req, res) => {

        const authenticatedUser = req.user.id;
        res.status(200).json({ user: authenticatedUser });
    
    });
    
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser(async (id, done) => {
        try{
            const user =  await dbUsers.getUserByIdHelper(id) 
            done(null, user)
        } catch(error) {
            done(error, null)
        }
       
    })
    
    //log out
    router.post('/logout', (req, res, next) => {
        req.logout((err) => {
            if(err){
                return next(err)
            }
            res.status(200).json({message:"user successfully loggged out"})
        });
    
        
    })
    return router
}

