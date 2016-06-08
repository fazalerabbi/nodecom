var router 		= require('express').Router();
var product 	= require('../modules/product');
var category 	= require('../modules/category');

// admin dashboard
router.get('/dashboard', function(req, res, next){
	res.render('admin/dashboard');
});

// products listing page
router.get('/products', function(req, res, next){
	var productObj = new product();
	var products = productObj.paginate(req, res, next, function(data) {
		res.render('admin/product/products',{data: data, success: req.flash("success")});
	});
});

// paginate the product listing page
router.get('/products/:page', function(req, res, next){
	var productObj = new product();
	var products = productObj.paginate(req, res, next, function(data){
		res.render('admin/product/products',{data: data, success: req.flash("success")});
	});
});

// load the create product template
router.get('/product/create', function(req, res, next) {
	var categoryObj = new category();
	var render = categoryObj.getAllCategories(function(categories){
		res.render('admin/product/edit', {
						product: null,
						categories: categories,
						success_message:''
				});
	});
});

// edit the product
router.get('/product/edit/:id', function(req, res, next){
	var productObj = new product();
	response = productObj.getSingleProduct(req, res, next, function(response) {
		res.render('admin/product/edit', { product: response.product, categories: response.categories, success_message: req.flash('success_message') });
	});
});

// save/update the product
router.post('/product/edit', function(req, res, next){
	var productObj = new product();

	response = productObj.save(req, res, next, function(id) {
		console.log(id);
		req.flash('success_message', 'Created/updated successfully.');
		res.redirect('/admin/product/edit/'+id);
	});
});

// delete the product
router.get('/product/delete/:id', function(req, res, next) {
		var productObj = new product();
		var deleted = productObj.delete(req, res, next, function(deletedProduct) {
			req.flash("success", "Deleted successfully.");
			return res.redirect('/admin/products');
		});
});

router.get('/add-category', function(req, res, next){
	res.render('admin/add-category'), {message: req.flash('success')}
});

router.post('/add-category', function(req, res, next){
	var categoryObj = new category();
	categoryObj.name = req.body.name;

	categoryObj.save(function(err){
		if(err) return next(err);

		req.flash('success', 'Successfully added a category');

		return res.redirect('/add-category');
	});
});



module.exports = router;
