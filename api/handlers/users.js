const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'masteruser',
    password: "ecommdbpw",
    host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
    database: "ecommdb",
    port: 5432,
    ssl: true
})
module.exports.getAllUsers = async (event) => {
    try{
        const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
        return {
            stausCode: 200,
            body: JSON.stringify(result.rows)
        }
    } catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }


}

module.exports.getUserById = async (event) => {
    try {
        const userId = event.pathParameters && event.pathParameters.id
        if(!userId){
            return{
                statusCode: 400,
                body: JSON.stringify({message: 'invalid user id'})
            }
        } else{
        const result  = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if(result.rows.length === 0){
            return {
                statusCode: 404,
                body: JSON.stringify({error: 'User not found'})
            }
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify(result.rows)
            }
        }
    }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
}