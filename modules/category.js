var categoryModel 	= require('../models/category');

function Category () {}

Category.prototype.getAllCategories = function(callback){
	var categories = null;
	categoryModel.find({}, function(err, categories){
		callback(categories);
	});
}

module.exports = Category;