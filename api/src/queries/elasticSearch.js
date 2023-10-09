//import elasticsearch client
const {Client} = require('@elastic/elasticsearch')
//create an elasticsearch client instance
const esClient = new Client({node: 'http://localhost:9200'})
//check if index exists then drop index
async function checkAndDropIndex(indexName) {
  try {
    // Check if the index exists
    const existsResponse = await esClient.indices.exists({
      index: indexName,
    });
  
    if (existsResponse === true) {
      // Index exists; drop (delete) it
      const dropResponse = await esClient.indices.delete({
        index: indexName,
      });

      if (dropResponse.acknowledged) {
        console.log(`Index '${indexName}' deleted successfully.`);
      } else {
        console.error(`Failed to delete index '${indexName}'.`);
      }
    } else {
      console.log(`Index '${indexName}' does not exist.`);
    }
  } catch (error) {
    console.error(`Error checking and dropping index '${indexName}':`, error);
  }
}


//define products index in elastic search
async function createIndex(){
    try{
        //delete index
         await checkAndDropIndex('product_index')
        
        await esClient.indices.create({
            index: 'product_index',
            body: {
                mappings:{
                    properties:{
                        product_name: {type: 'text'},
                        product_description: {type: 'text'},
                        category: {type: 'keyword'},
                        price: {type: 'float'}, 
                        available_quantities: {type: 'integer'},
                        image_url: {type: 'text'}
                    }
                }
            }
        });
    console.log('index created successfully')

    } catch(error){
        console.error('Error creating index: ', error)

    }
}
//adds data from products table to elastic search
async function indexProductData(pool){
    try{
        const productData = await pool.query('SELECT * FROM products');
        const products = productData.rows;
        //array to store bulk indexing
        const bulkBody = [];

        //loop through products and create index reqs
        products.forEach((product) => {
            bulkBody.push(
                {index: {_index:'product_index', _id: product.id}},
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
        
        //use elasticsearch client to perform bulk indexing
        const {body: bulkResponse} = await esClient.bulk({ refresh: true, body: bulkBody });
        
        if(bulkResponse.errors){
            console.error('Failed to index some products', bulkResponse.items);
        } else{
            console.log(`Indexed ${products.length} products`)
        }
    

    }catch(error){
        console.error('Error indexing products:', error)

    }
}

//search function
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
    console.log('Error searching documents: ', error)

  }
} 
module.exports={
    createIndex,
    indexProductData, 
    searchProducts
}