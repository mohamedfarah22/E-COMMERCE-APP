const Pool = require('pg').Pool;
const LocalStrategy = require('passport-local').Strategy;
const pool = new Pool({
    user:"admin",
    password: "ecommdb",
    host: "ecomm-database-postgres",
    database: "ecommercedatabase",
    port: 5432
});
const express = require('express');
const router = express.Router();
const db = require('../queries/authQueries')
const dbUsers = require('../queries/userQueries')
const passport = require('passport');
//registration

router.post('/register', db.createUser)

//login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async function( email, password, done){
    console.log(`Authenticatin user: ${email}`)
    pool.query('SELECT * FROM users WHERE email = $1', [email], async function(err, results){
        if(err){
            console.log('database error')
            return done(err)
        }

        if(results.rows.length === 0){
            console.log('User not found', email)
            return done(null, false, {message: 'Incorrect email or password'})
        }

        const user = results.rows[0]

        const passwordAuthenticated = await db.comparePasswords(password, user.password)

        if(passwordAuthenticated){
            console.log('User authenticated', email)
            return done(null, user)
        }
        else{
            console.log('Incorrect password for user:', email)
            return done(null, false, {message: 'Incorrect password. '})
        }

    });

})
)




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


module.exports = router;