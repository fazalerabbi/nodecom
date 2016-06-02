var productModel 	= require('../models/product');
var Product =  function () {};

Product.prototype.paginate = function(req, res, next, callback){
	var perpage = 9;
	var page = req.params.page || 1; // if page is not defined then set page to 1
	var response = [];
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
Product.prototype.getSingleProduct = function(req, res, next, callback) {
	var id = req.params.id || null;
	if(id == null) {
		console.log(id);
	}
	productModel
	.find({_id: red.params})
} 

module.exports = Product;