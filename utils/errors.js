class NotFoundError extends Error {
  constructor (message = '') {
    super(message)
    this.name = 'NotFoundError'
  }
}

class InternalServerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InternalServerError'
  }
}

module.exports = {
  NotFoundError,
  InternalServerError,
  handleError: (err, res) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: err.name + ' : ' + err.message })
    } else if (err.name === 'NotFoundError') {
      res.status(404).json({ message: 'Record Not Found' })
    } else if (err.name === 'InternalServerError') {
      res.status(500).json({ message: 'Internal Server Error : ' + err.message })
    } else {
      res.status(500).json({ message: err.name + ' : ' + err.message })
    }
  }
}
