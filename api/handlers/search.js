module.exports.indexProductData = async (event) => {
    return {
        statusCode: 201,
        body: JSON.stringify({message: 'index endpoint'})
    }
}

module.exports.search = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'search products endpoint'})
    }
}