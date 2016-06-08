var async 			= require('async');
var productModel 	= require('../models/product');
var category 		= require('./category');

var Product 		=  function () {};

/**
 * Pagination
*/
Product.prototype.paginate = function(req, res, next, callback){
	var perpage = 9;
	var response = [];
	var page = req.params.page;
	// if page is not defined then set page to 1
	if(req.params.page == null) {
		page = 1;
	}
	page = page - 1;

	productModel
	.find()
	.skip( perpage * page )
	.limit( perpage )
	.populate('category')
	.exec(function(err, products) {
		if(err) return err;
		productModel.count().exec(function(err, count) {
				if(err) return err;
				//res.render('site/index');
				response = {
					products: products,
					pages: Math.floor(count/perpage),
					page: page
				};
				callback(response);
				/*res.render('main/product-main', {
					products: products,
					pages: count/perpage
				});*/
		});
	});
}

//get single product
Product.prototype.getSingleProduct = function(req, res, next, callbackMain) {
	var id = req.params.id || null;

	if(id == null) {
		console.log(id);
		return false;
	}
	async.waterfall(
		[
			function(callback) {
				var categoryModule = new category();
				categoryModule.getAllCategories(function(categories){
					callback(null, categories);
				});
			},
			function(categories){
				productModel
				.findOne({ _id: req.params.id }, function(err, product){
					if(err) return err;

					var response = {
						product: product,
						categories: categories
					};

					callbackMain( response );
				});
			}
		]);
}

// create or update the product
Product.prototype.save = function(req, res, next, callback){
	if(req.body._id != 'null') {
		productModel
		.update(
				{ _id: req.body._id },
				{
					category : req.body.category,
					name	 : req.body.name,
					price	 : req.body.price,

				}, { multi: false }, function(err, number){
					callback(req.body._id);
				});
	} else {
		var productObj = new productModel();
		productObj.category = req.body.category;
		productObj.name = req.body.name;
		productObj.price = req.body.price;
		productObj.save(function(err, newproduct){
			if(err) return next(err);
			callback(newproduct._id);
		});
	}
}

//delete the product
Product.prototype.delete = function(req, res, next, callbackMain){
	productModel.remove({_id: req.params.id}, function(err){
    if(err) return next(err);
		callbackMain(req.params.id);
	});
}
module.exports = Product;
