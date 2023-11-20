const aws4 = require('aws4');
const Pool = require('pg').Pool;
const https = require('https');
require('dotenv').config();

const pool = new Pool({
    user: 'masteruser',
    password: 'ecommdbpw',
    host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
    database: 'ecommdb',
    port: 5432,
    ssl: true
});

module.exports.bulkIndexProductData = async (event) => {
    try {
        const productData = await pool.query('SELECT * FROM products');
        const products = productData.rows;
        const bulkBody = [];

        // loop through products and create index reqs
        products.forEach((product) => {
            bulkBody.push(
                { index: { _index: 'product_index', _id: product.id } },
                {
                    product_name: product.product_name,
                    product_description: product.product_description,
                    category: product.category,
                    price: product.price,
                    available_quantity: product.available_quantity,
                    image_url: product.image_url
                }
            );
        });

        const requestBody = bulkBody.map(JSON.stringify).join('\n') + '\n';

        const requestOptions = aws4.sign({
            hostname: 'search-product-search-3rxti5gq3imvvpyqxa5jub5aua.ap-southeast-2.es.amazonaws.com',
            service: 'es',
            region: 'ap-southeast-2',
            method: 'POST',
            path: '/product_index/_bulk',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody
        }, {
            accessKeyId: 'AKIAVAPEO6NFPIXWWJNQ',
            secretAccessKey: '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',
        });

        // Make the HTTP request
        const response = await new Promise((resolve, reject) => {
            const req = https.request(requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(requestOptions.body);
            req.end();
        });

        console.log(response);

        return {
            statusCode: 200,
            body: JSON.stringify({ response: response }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

module.exports.search = async(event) => {
  try {
    const query = event.queryStringParameters && event.queryStringParameters.query
    if(!query){
      return{
        statusCode: 404,
        body: JSON.stringify({message: 'please type in a search query'})
      }
    }else {
      console.log( process.env)
      const requestOptions = aws4.sign({
        hostname: 'search-product-search-3rxti5gq3imvvpyqxa5jub5aua.ap-southeast-2.es.amazonaws.com',
        service: 'es',
        region: 'ap-southeast-2',
        method: 'GET',
        path: `/product_index/_search?q=${query}`,
    }, {
      accessKeyId: 'AKIAVAPEO6NFPIXWWJNQ',
      secretAccessKey: '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',
    });
    const response = await new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
          let data = '';

          res.on('data', (chunk) => {
              data += chunk;
          });

          res.on('end', () => {
              resolve(data);
          });
      });

      req.on('error', (error) => {
          reject(error);
      });

      req.end();
  });

  
  const parsedResponse = JSON.parse(response);
  console.log('Search Response:', parsedResponse.hits.hits);


  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
     
    },
      statusCode: 200,
      body: JSON.stringify(parsedResponse.hits.hits),
  };
    }
    
  } catch(error){
    return {
      headers: {
          'Access-Control-Allow-Origin': '*',
         
        },
      statusCode: 500,
      body: JSON.stringify({error: error})
  }


  }
} 


