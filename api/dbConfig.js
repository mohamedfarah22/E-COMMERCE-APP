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
} 
else if(process.env.NODE_ENV === 'pg-test-error'){
    pool.query = jest.fn((query, values, callback) => {
        // Simulate a database error for any query
        callback(new Error('Database connection issue'), null);
      });
}
else{
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