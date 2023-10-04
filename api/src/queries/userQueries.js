

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



module.exports = {
    getUsers, 
    getUserByIdHelper
}