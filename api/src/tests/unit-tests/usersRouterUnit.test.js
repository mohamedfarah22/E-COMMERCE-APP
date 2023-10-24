const express = require('express')
const bodyParser = require('body-parser')
const Pool = require('pg').Pool
const app = express();
const session = require('express-session')
const passport = require('passport')
const db = require("../../../src/queries/authQueries")
app.use(bodyParser.json())

app.use(
  session({
    secret: "qEas5ns3gxl41G",
    cookie: { maxAge: 86400000, secure: false },
    resave: false,
    saveUninitialized: false
  })
 );

//initialise passport and session

app.use(passport.initialize());
app.use(passport.session());
jest.mock('pg', () => {
    return {
      Pool: jest.fn(() => ({
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
      })),
    };
  });
  

  const pool = new Pool();

const usersRouter = require('../../Routers/usersRouter')(pool)
const authRouter = require('../../Routers/authRouter')(pool)
const request  = require('supertest');
app.use('/users',  usersRouter)
app.use('/auth', authRouter)

describe('users router get all users', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM users ORDER BY id ASC'){
                callback(null, {
                    rows: [
                        {
                            id: 1,
                           first_name: 'Mohamed',
                           last_name: 'Farah',
                           email: 'mohamed.farah9810@gmail.com',
                           password: 'test-password'
                        }
                    ]
                })
            }
            
        })
    })
    it('should return status code of 200 and an array of user objects', async () => {
        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual( [
            {
                id: 1,
               first_name: 'Mohamed',
               last_name: 'Farah',
               email: 'mohamed.farah9810@gmail.com',
               password: 'test-password'
            }
        ])
    })
})
describe('users router get user by ID', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM users WHERE id = $1'){
               return Promise.resolve({
                    rows: [
                        {
                            id: 1,
                           first_name: 'Mohamed',
                           last_name: 'Farah',
                           email: 'mohamed.farah9810@gmail.com',
                           password: 'test-password'
                        }
                    ]
                })
            }     
        })
    })
    it('should return status code of 200 and an array of the user object with correct ID', async () => {
        const response = await request(app).get('/users/1');

        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual( [
            {
                id: 1,
               first_name: 'Mohamed',
               last_name: 'Farah',
               email: 'mohamed.farah9810@gmail.com',
               password: 'test-password'
            }
        ])
    })
})
describe('users router get user by ID', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM users WHERE id = $1'){
               return Promise.resolve({
                    rows: []
                })
            }     
        })
    })
    it('should return status code of 404 and an error object stating user not found', async () => {
        const response = await request(app).get('/users/1');

        expect(response.status).toBe(404);
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
        expect(response.body).toStrictEqual( 
            { error: 'User not found' }
        )
    })
})
describe('auth router register new user', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *'){
               callback(null, {
                rows: [
                    {
                        email: 'moahamed.farah9831@gmail.com'
                    }
                ]
               })
            }     
        })
    })
    it('should return status code of 200 and the new users email', async () => {
        const response =await request(app).post('/auth/register').send({
            first_name: 'Mustafa',
            last_name: 'Farah',
            email: 'moahamed.farah9831@gmail.com',
            password: 'password'
        });

        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
        expect(response.body).toStrictEqual( 
            {  email: 'moahamed.farah9831@gmail.com' }
        )
    })
})
describe('auth router login', () => {
    beforeEach(async () => {
        const password = await db.passwordHash('test-password', 3)
     pool.query = jest.fn((query, values, callback) => {
        if(typeof values === 'function'){
            callback=values
            values=undefined
        }
        if(query === 'SELECT * FROM users WHERE email = $1' ){
            callback(null, {
                rows : [
                    {
                        id: 1,
                       first_name: 'Mohamed',
                       last_name: 'Farah',
                       email: 'mohamed.farah9810@gmail.com',
                       password: password
                    }
                
            ]
        })
        }
    })
     })
    
    it('should return status code of 200 auser object when loggedin', async () => {
        const response =await request(app).post('/auth/login').send({
            email: 'moahamed.farah9810@gmail.com',
            password: 'test-password'
        });
        
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
        expect(response.body).toStrictEqual( 
            {  user: 1 }
        )
    })
})
describe('auth router login', () => {
    beforeEach(async () => {
        
     pool.query = jest.fn((query, values, callback) => {
        if(typeof values === 'function'){
            callback=values
            values=undefined
        }
        if(query === 'SELECT * FROM users WHERE email = $1' ){
            callback(null, {
                rows : []
        })
        }
    })
     })
    
    it('should return status code of 401 when user not logged in', async () => {
        const response =await request(app).post('/auth/login').send({
            email: 'moahamed.farah9810@gmail.com',
            password: 'test-password'
        });
      expect(response.status).toBe(401)
    })
})
describe('auth router logout', () => {
    
    it('should return status code of 200 when user successfully logged out', async () => {
        const req = {
            logout: jest.fn(),
        };
        const response =await request(app).post('/auth/logout');
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({message:"user successfully loggged out"})
    })
})
