const { Number } = require('mongoose');
var mongoose = require('mongoose');
var db = require ('../db');

var Sample = db.model('Sample',{
	id:{type:Number, required: true, default: 1 },
	c_id: {type : Number, required : true},// collection id
    donor_count: {type : Number},
	mat_type: {type: String},//material type
    date:{type : Date, required : true, default : +new Date()}	// updated date
})

module.exports = Sample;