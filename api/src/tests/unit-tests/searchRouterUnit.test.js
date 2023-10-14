const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const request  = require('supertest');

const elasticSearch = require('../../queries/elasticSearch')
const searchRouter  = require('../../Routers/searchRouter')
jest.mock('../../queries/elasticSearch', () => {
    return {
      searchProducts: jest.fn(),
    };
  });
  
  
app.use('/search', searchRouter)

describe('search router unit test', () => {
    
    it('should set status as 200 and send back results', async () => {
        elasticSearch.searchProducts.mockResolvedValue([
            { _source: { field1: 'value1' } },
            { _source: { field2: 'value2' } },
          ]);
        const response  = await request(app).get('/search?q=search')
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
      { _source: { field1: 'value1' } },
      { _source: { field2: 'value2' } },
    ]);
    })
})