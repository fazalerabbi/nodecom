var mongoose = require('mongoose');
var schema = mongoose.Schema;

var categorySchema = new schema({
	name: {type: String, unique: true, lowercase: true}
});

module.exports = mongoose.model('Category', categorySchema);