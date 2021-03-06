const Car = require('mongoose').model('Car')
const errorHandler = require('../utilities/errorhandler')

module.exports = {
  addGet: (req, res) => {
    res.render('cars/add')
  },
  addPost: (req, res) => {
    let carReq = req.body
    if (carReq.pricePerDay <= 0) {
      res.locals.globalError = 'Cannot be less than 0'
      res.render('cars/add', carReq)
      return
    }
    Car.create({
      make: carReq.make,
      model: carReq.model,
      year: carReq.year,
      pricePerDay: carReq.pricePerDay,
      power: carReq.power,
      image: carReq.image
    }).then(car => {
      res.redirect('/cars/all')
    }).catch(err => {
      let message = errorHandler.handleMongooseError(err)
      res.locals.globalError = message
      res.render('cars/add', carReq)
    })
  },
  all: (req, res) => {
    let pageSize = 2
    let page = parseInt(req.query.page) || 1
    let search = req.query.search
    let query = Car.find({})
    if (search) {
      query = query.where('make').regex(new RegExp(search, 'i'))
    }
    query.sort('-createdOn').skip((page - 1) * pageSize).limit(pageSize).then((cars) => {
      res.render('cars/all', {
        cars: cars,
        hasPrevPage: page > 1,
        hasNextPage: cars.length > 0,
        nextPage: page + 1,
        prevPage: page - 1,
        search: search
      })
    })
  }
}
