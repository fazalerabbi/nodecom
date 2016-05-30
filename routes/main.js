var router = require('express').Router();
var product 	= require('../models/product');

product.createMapping(function(err, mapping) {
	if(err){
		console.log("error creating mapping");
		console.log(err);
	} else {
		console.log("Mapping created");
		console.log(mapping);
	}
});

var stream = product.synchronize();
var count = 0;

stream.on('data', function(){
	count++;
});
stream.on('close', function(){
	console.log("Indexed "+ count + "documents");
});
stream.on('error', function(err) {
	console.log(err);
});

router.get('/', function(req, res, next){
	var perpage = 9;
	var page = req.params.page;
	product
	.find()
	.skip( perpage * page )
	.limit( perpage )
	.populate('category')
	.exec(function(err, products) {
		if(err) return next(err);
		product.count().exec(function(err, count) {
				if(err) return next(err);
				res.render('site/index');
				/*res.render('main/product-main', {
					products: products,
					pages: count/perpage
				});*/
		});
	});
	//res.render('site/index');
});

router.post('/search', function(req, res, next){
	res.redirect('/search?q='+req.body.q);
});

router.get('/search', function(req, res, next) {
	if(req.query.q) {
		product.search({
			query_string: {query: req.query.q}
		}, function(err, results){
			if(err) return next(err);
			var data = results.hits.hits;
			res.json(data);
		});
	}
});
router.get('/product/:id', function(req, res, next){
	product
	.find({category: req.params.id})
	.populate('category')
	.exec(function(err, products) {
		if(err) return next(err);
		/*res.render('admin/category', {
			products: products
		});*/
		res.json(products);
	});
});

/*router.get('/:id'+'.html', function(req, res, next){
	product
	.findOne({_id: req.params.id})
	.populate('category')
	.exec(function(err, product){
		if(err) return next(err);
		res.json(product);
	});
});*/

module.exports = router;