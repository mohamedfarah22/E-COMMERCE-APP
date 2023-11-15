const express = require('express');
const router = express.Router();
const elasticSearch = require('../queries/elasticSearch')



    
    router.get('/', async(req, res)=> {
        const {q} = req.query;
        const results = await elasticSearch.searchProducts(q)
        res.status(200).send(results)
    })
module.exports = router



