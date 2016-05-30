var router 		= require('express').Router();
var category 	= require('../models/category');


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