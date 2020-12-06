const errorNames = {
  notFound: 'NotFoundError',
  internalServer: 'InternalServerError',
  duplicateRecord: 'DuplicateRecordError',
  badReqeust: 'BadRequestError',
  unauthorized: 'UnauthorizedError'
}

class NotFoundError extends Error {
  constructor (message = 'record not found') {
    super(message)
    this.name = errorNames.badReqeust
  }
}

class InternalServerError extends Error {
  constructor (message = 'internal server error') {
    super(message)
    this.name = errorNames.internalServer
  }
}

class DuplicateRecordError extends Error {
  constructor (message = 'duplicate record') {
    super(message)
    this.name = errorNames.duplicateRecord
  }
}

class BadRequestError extends Error {
  constructor (message = 'bad request') {
    super(message)
    this.name = errorNames.badReqeust
  }
}

module.exports = {
  NotFoundError,
  InternalServerError,
  DuplicateRecordError,
  BadRequestError,
  handleError: (err, res) => {
    const error = {
      message: err.name + ': ' + err.message,
      error: err
    }
    if (err.name === errorNames.badReqeust) {
      res.status(400)
    } else if (err.name === errorNames.unauthorized) {
      res.status(401)
    } else if (err.name === errorNames.notFound) {
      res.status(404)
    } else if (err.name === errorNames.internalServer) {
      res.status(500)
    } else {
      res.status(500)
    }
    res.json(error)
  }
}
