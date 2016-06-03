var router 		= require('express').Router();
var product 	= require('../modules/product');


router.get('/dashboard', function(req, res, next){
	res.render('admin/dashboard');
});

router.get('/products', function(req, res, next){
	console.log(req.params.page);
	var productObj = new product();
	var products = productObj.paginate(req, res, next, function(data) {
		res.render('admin/product/products',{data: data});
	});
});

router.get('/products/:page', function(req, res, next){
	console.log(req.params.page);
	var productObj = new product();
	var products = productObj.paginate(req, res, next, function(data){
		res.render('admin/product/products',{data: data});
	});
});

router.get('/product/edit/:id', function(req, res, next){
	var productObj = new product();

	response = productObj.getSingleProduct(req, res, next, function(response) {
		res.render('admin/product/edit', { product: response.product, categories: response.categories, success_message: req.flash('success_message') });
	});
});

router.post('/product/edit/', function(req, res, next){
	var productObj = new product();

	response = productObj.save(req, res, next, function(id) {
		req.flash('success_message', 'Created/updated successfully.');
		res.redirect('/admin/product/edit/'+id);
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