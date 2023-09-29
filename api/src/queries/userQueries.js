

const Pool = require('pg').Pool;

const pool = new Pool({
    user:"admin",
    password: "ecommdb",
    host: "ecomm-database-postgres",
    database: "ecommercedatabase",
    port: 5432
});

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error){
            throw(error)
        }
        res.status(200).json(results.rows)
    })
}

const getUserByIdHelper = (id) => {
   return new Promise((resolve, reject) => {
     pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if(error){
            reject(error)
        } else {
            resolve(results.rows);
        }
    })
}) 
}

const getUserById = async (req, res) => {
    const userId = req.params.id
    try{
        const users = await getUserByIdHelper(userId)
        res.status(200).json(users)
    }
    catch(e){
        res.status(404).send(e)
    }
    
}

module.exports = {
    getUsers, 
    getUserByIdHelper,
    getUserById
}