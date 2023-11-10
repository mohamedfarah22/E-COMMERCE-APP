const {Client} = require('@elastic/elasticsearch');
const AWS = require('aws-sdk');
const axios = require('axios');
const {aws4Interceptor} = require("aws4-axios")
const connection = require('http-aws-es')

const credentials = new AWS.Credentials({
    accessKeyId: "AKIAVAPEO6NFDJAFENGX",
    secretAccessKey: "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"
})
const region = "ap-southeast-2"
const esClient = new Client({
    nodes: 'https://search-product-search-3rxti5gq3imvvpyqxa5jub5aua.ap-southeast-2.es.amazonaws.com/',
    connectionClass: connection,
    awsConfig: new AWS.Config({region, credentials})
})

const Pool = require('pg').Pool;
const fetch = require('node-fetch-commonjs')

const pool = new Pool({
    user: 'masteruser',
    password: "ecommdbpw",
    host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
    database: "ecommdb",
    port: 5432,
    ssl: true
})
//es url
const url = 'https://search-product-search-3rxti5gq3imvvpyqxa5jub5aua.ap-southeast-2.es.amazonaws.com/';

//function to check if elastic search index exists
async function checkIfEsIndexExists(indexName, url){
    
    try {
        const response = await fetch(url, { method: 'HEAD' });
    
        if (response.ok) {
          return true
          
        } else {
          console.error(`Error: HTTP ${response.status} ${response.statusText}`);
        }
      } 
    catch (error) {
        throw new Error(error)
       
      }
    }
    
//search function for es 2.3
async function searchProducts(searchPhrase){
    try{
      const body = await esClient.search({
        index: 'product_index',
        body: {
          query:{
            multi_match:{
              query: searchPhrase,
              fields: ["product_name", "product_description", "category"]
  
            },
          },
        },
      });
  
    return body.hits.hits
    } catch(error){
        throw new Error('Error searching documents '+ error.message)
      
  
    }
  } 
//function to create index

async function createIndex(indexName) {
    try {

        await esClient.indices.create({
            index: indexName,
            body: {
                settings: {
                    index: {
                        number_of_shards: 1,
                        number_of_replicas: 1
                    }
                },
                mappings: {
                    properties: {
                        product_name: { type: 'text' },
                        product_description: { type: 'text' },
                        category: { type: 'keyword' },
                        price: { type: 'float' },
                        available_quantities: { type: 'integer' },
                        image_url: { type: 'text' }
                    }
                }
            }
        });
        return true;
    } catch (error) {
        throw new Error('Error creating index: ' + error.message);
    }
}
//adds data from products table to elastic search
async function indexProductDataFromSQL(pool) {
    try {
      // Fetch product data from the SQL database
      const productData = await pool.query('SELECT * FROM products');
      const products = productData.rows;
  
      // Prepare the bulk request body
      let bulkRequestBody = '';
  
      products.forEach((product) => {
        bulkRequestBody += JSON.stringify({ index: { _index: 'test', _id: product.id } }) + '\n';
        bulkRequestBody += JSON.stringify({
          product_name: product.product_name,
          product_description: product.product_description,
          category: product.category,
          price: product.price,
          available_quantity: product.available_quantity,
          image_url: product.image_url,
        }) + '\n';
      });
  
      const { body: response } = await esClient.bulk({ refresh: true, body: bulkRequestBody });
      
      if (response.errors) {
        throw new Error('Failed to index some products', response.items);
      } else {
        return true;
      }
    } catch (error) {
      throw new Error('Error indexing products: ' + error.message);
    }
  }
  

module.exports.createMappingForIndex = async (event) => {
    //check if index exists
    try {
        const indexExists = await checkIfEsIndexExists('product_index', url);

        if(!indexExists){
            try {
                const indexCreated = await createIndex('product_index');
                if(indexCreated){
                    return{
                        statusCode: 200,
                        body: JSON.stringify({message: 'Index successfully created'})
                    }
                }
            } catch (error) {
                return{
                    statusCode: 500,
                    body: JSON.stringify({message: error.message})
                }
            }
           
    
        }
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message})
        }
        
    }
   
}
module.exports.bulkProductDatatToES = async (event) => {
 try {
    const indexedProductData = await indexProductDataFromSQL(pool);
    if(indexedProductData){
        return {
            statusCode: 200,
            body: {message: 'product data index successful'}
        }
    }

    
 } catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: 'product data index successful' })
    }
 }
}
module.exports.search = async (event) => {
    try {
    const searchQuery = event.queryStringParameters && event.queryStringParameters.q
    if(!searchQuery){
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'please provide search query'})
        }
    }
    else{
        const results = await searchProducts(searchQuery);
        return {
            statusCode: 200,
            body: JSON.stringify(results)
        }

    }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message})
        }
        
        
    }

}