const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  console.log(error.message)

  if (error) {
    return response.status(400).send(error.message)
  } else next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
