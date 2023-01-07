const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error) {
        return response.status(400).send(error.message)
      } else 
    next(error)
  }
  
  module.exports = {
    unknownEndpoint,
    errorHandler
  }

  /*if (error.name === 'SequelizeValidationError') {
        return response.status(400).send({ error: 'Invalid input' })
    } */