const pool = require('../../dbConfig')
const app = require('../../server')
const request  = require('supertest')
//set environment as test to connect to test db
process.env.NODE_ENV = 'test';