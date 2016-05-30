var router = require('express').Router();

var async = require('async');
var faker = require('faker');

var category = require('../models/category');
var product = require('../models/product');

router.get('/:name', function(req, res, next){

	async.waterfall([
			function(callback) {
				category.findOne({name: req.params.name}, function(err, category) {
						if(err) return next(err);
						callback(null, category);
					});
			},
			function(category, callback) {
				for (var i = 0; i < 30; i++) {
					var productObj = new product();
					productObj.category = category._id;
					productObj.name = faker.commerce.productName();
					productObj.price = faker.commerce.price();
					productObj.image = faker.image.image();

					productObj.save();
				}
			}
		]);

		res.json({message: 'Success'});
});

module.exports = router;