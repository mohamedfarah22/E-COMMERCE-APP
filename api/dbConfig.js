const Pool = require('pg').Pool;

let pool;

if(process.env.NODE_ENV === 'test') {
    //use test database
    pool =  new Pool({
        user:"admin",
        password: "ecommdbtest",
         host: "localhost",
        database: "ecommercedatabasetest",
        port: 5433
    })
} else{
    //use product database
    pool = new Pool({
        user:"admin",
        password: "ecommdb",
        host: "ecomm-database-postgres",
        database: "ecommercedatabase",
        port: 5432
    })
}
 module.exports = pool