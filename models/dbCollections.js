const { Number } = require('mongoose');
var mongoose = require('mongoose');
var db = require ('../db');

const Schema = new mongoose.Schema({
	id:{type:Number, required: true, default: 1 },
	disease_term: {type : String, required : true},
    title: {type : String, required : true},
    date:{type : Date, required : true, default : +new Date()}    
});

var Collection = db.model('Collection',Schema);
/*
Schema.pre('save',(next)=>{
    if (this.isNew) {
        Collection.find().sort({ id: -1 }).limit(1) // find last document
        .then((entries) => {
            this.id = entries[0].id + 1;
            next();
        })
    }    
})
*/


module.exports = Collection;