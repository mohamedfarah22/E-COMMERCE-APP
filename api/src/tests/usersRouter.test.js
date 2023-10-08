//import pg pool, router and express
const pool = require('../../dbConfig')
const app = require('../../server')
const request  = require('supertest')



//set as test incaase 
process.env.NODE_ENV = 'test';

describe('test users router success path', () =>{
    beforeAll(async () => {
        await pool.query('DROP TABLE IF EXISTS users');
        await pool.query(`CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            first_name VARCHAR NOT NULL,
            last_name VARCHAR NOT NULL,
            email VARCHAR UNIQUE NOT NULL,
            password VARCHAR NOT NULL
        )`)
        //add sample user data
        await pool.query(`
        INSERT INTO users(first_name, last_name, email, password)
        VALUES
       ('Mohamed', 'Farah', 'mohamed.farah9810@gmail.com', 'password'),
        ('Mustafa', 'Farah', 'mustafa.farah@gmail.com', 'password');`)
})
    it('test get users endpoint should return status code of 200 and array of all users', async () => {
     
      const response= await request(app).get('/users');
        //assert 
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        const expectedResult = [{
            id: 1,
            first_name: 'Mohamed',
            last_name: 'Farah',
            email: 'mohamed.farah9810@gmail.com',
            password: 'password'
        },
        {
            id: 2,
            first_name: 'Mustafa',
            last_name: 'Farah',
            email: 'mustafa.farah@gmail.com',
            password: 'password'
        }
    ]

    expect(response.body).toStrictEqual(expectedResult)
    })
    it('test get users endpoint should return status code of 200 and user with specific ID', async () => {
     
        const response= await request(app).get('/users/1');
          //assert
          
          expect(response.status).toBe(200);
          expect(response.type).toBe('application/json');
          expect(Array.isArray(response.body)).toBe(true);
          const expectedResult = [{
              id: 1,
              first_name: 'Mohamed',
              last_name: 'Farah',
              email: 'mohamed.farah9810@gmail.com',
              password: 'password'
          },
        ]
        
      expect(response.body).toStrictEqual(expectedResult)
      })
      it('test get users endpoint should return status code of 404 when user with invalid ID is passed in', async () => {
     
        const response= await request(app).get('/users/11');
          //assert
          
          expect(response.status).toBe(404);
          expect(response.type).toBe('application/json');
          expect(typeof response.body).toBe('object');
         
        
            expect(response.body).toStrictEqual({ error: 'User not found' })
      })

    afterAll(() => {
        
        pool.end()
        
        })
    })
    process.env.NODE_ENV ='pg-test-error'
    describe('test user endpoint when user db error occurs', () =>{
        it('returns 500 with internal server error when db query error', async () => {

        const response= await request(app).get('/users');
        expect(response.status).toBe(500);
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
       
      
          expect(response.body).toStrictEqual({ error: "Internal server error" })
        })
        it('returns 500 with internal server error when db query error for retrieving user by ID', async () => {

            const response= await request(app).get('/users/1');
            expect(response.status).toBe(500);
            expect(response.type).toBe('application/json');
            expect(typeof response.body).toBe('object');
           
          
              expect(response.body).toStrictEqual({ error: "Internal server error" })
            })
    })
