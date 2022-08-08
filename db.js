var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//'mongodb+srv://TissueSampleDB:UniversityNottingham{2022}@cluster0.kbrljqd.mongodb.net/TissueSampleDB?retryWrites=true&w=majority'
mongoose.connect('mongodb+srv://TissueSampleDB:UniversityNottingham{2022}@cluster0.kbrljqd.mongodb.net/TissueSampleDB',{user:'TissueSampleDB', pass:'UniversityNottingham{2022}', useNewUrlParser: true, useUnifiedTopology: true},function(err){
	if (err) {
        throw err;
    } else {
		console.log('mongodb connected to ATLAS Cloud');
	}
})
mongoose.set('useCreateIndex', true);// new updates

module.exports = mongoose;