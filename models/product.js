var mongoose 		= require('mongoose');
var mongoosastic 	= require('mongoosastic');
var schema 	 		= mongoose.Schema;

var productSchema 	= new schema({
	category: {type: schema.Types.ObjectId, ref: 'Category'},
	name: String,
	price: Number,
	image: String
});

productSchema.plugin(mongoosastic, {
	hosts: [
		'localhost:9200'
	]
});
module.exports = mongoose.model('Product', productSchema);