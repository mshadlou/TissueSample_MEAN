var router = require('express').Router();
var Collection = require('../../models/dbCollections');
var Sample = require('../../models/dbSamples');

	
//////////////////////////////// fetch collection
router.get('/getCollection/:p_id/:MaxPerPage',function(req,res, next){
	try{
		//Collection.find({id: { $gte: parseInt(req.params.p_id) }})
		Collection.find({})
		.select('id').select('disease_term').select('title').select('date')
		//.limit(parseInt(req.params.MaxPerPage))
		.exec(function(err,cols){
			if (err){
				res.send({out:false, message:' An error to get Collection data. Try agian, please!'});
			}
			if (cols.length == 0){
				res.send({out:false, message:'2: No data to fetch from Collection Table. Try agian, please!'});
			} else {				
				let i = (parseInt(req.params.p_id) - 1)*parseInt(req.params.MaxPerPage);
				if (i + parseInt(req.params.MaxPerPage) < cols.length){
					if (parseInt(req.params.p_id) > 1){
						res.send({out:true, message:'Done', data: cols.slice(i, i+parseInt(req.params.MaxPerPage)), count: cols.length, next:true, prev:true });
					} else {
						res.send({out:true, message:'Done', data: cols.slice(i, i+parseInt(req.params.MaxPerPage)), count: cols.length, next:true, prev:false });
					}
				} else {
					if (parseInt(req.params.p_id) > 1){
						res.send({out:true, message:'Done', data: cols.slice(i,cols.length), count: cols.length, next:false, prev:true });
					} else {
						res.send({out:true, message:'Done', data: cols.slice(i,cols.length), count: cols.length, next:false, prev:false });
					}
				}
			}
		})
	} catch(err) {
		console.log(err);
		res.send({out:false,  message:'Catch throw exception!'});
	}
})	
/////////////////////////////// Search collection
router.get('/searchCollection/:query',function(req,res, next){
	Collection.aggregate([
		{
			$match: {
				$or:[
					//{title:{$regex: new RegExp(req.params.query, "i")}}, // make case insensitive for small/capital letters
					//{disease_term:{$regex: new RegExp(req.params.query, "i")}} // make case insensitive for small/capital letters
					{title:{$regex: new RegExp(`^.*${req.params.query}.*`, "ig")}}, // make case insensitive for small/capital letters
					{disease_term:{$regex: new RegExp(`^.*${req.params.query}.*`, "ig")}} // make case insensitive for small/capital letters
				]
				// Add .* before and after to get the regex to work so that position in word doesn't matter, though regex is unneccesary based on your requirements
			}
		}
	]).exec(function(err,cols){
		if (!cols){
			res.send({out:false, message:'No data is available for this query!'});
		} else {
			res.send({out:true, message:'Done', data: cols });
		}
	});
})	
///////////////////////////////// CRUD for Collection
router.post('/CRUDcollection',function(req,res, next){
	try{
		if (req.body.com === "delete"){
			Collection.deleteOne({id: req.body.data.id})
			.exec(function(err,cols){
				if(err) {
					res.json({out:false, message:'An Error on deleting the collection'});	
				}
				if(!cols) { 
					res.json({out:false, message:'This record does not exist to be deleted!'});	
				} else {
					// now we should delete all samples associated with collection
					Sample.deleteMany({c_id: req.body.data.id})
					.exec(function(err,smpls){
						if(err) {
							res.json({out:false, message:'An Error on deleting the Sample document!'});	
						} else {
							res.json({out:true, message:'A collection and its associated Samples were deleted!'});
						}	
					})	
				}
			})
		} else {
			Collection.findOne({id:req.body.data.id})
			.select('id').select('disease_term').select('title').select('date')
			.exec(function(err,cols){
				if(err) {
					res.json({out:false, message:'An Error on updating/creating a collection'});	
				}
				if(!cols) { // create new document
					var collection = new Collection({
						disease_term:req.body.data.disease_term,
						title:req.body.data.title,
					})
					
					Collection.find().sort({ id: -1 }).limit(1) // find last document
					.exec((err,col)=>{
						let idv = 1;
						if (col[0]){
							idv = col[0].id + 1;
						}
						collection.id = idv;
						collection.save((error,coll)=>{
							if (!error){
								res.json({out:true, message:'A new record of Collection was created!', data: coll, create: true});
							} else {
								console.log(error);
								res.json({out:false, message:'An error on creating new record has been encountered!'});
							}
						});
					});

				} else { // edit previous document
					cols.title = req.body.data.title;
					cols.disease_term = req.body.data.disease_term;
					cols.save((error,col)=>{
						if (!error){
							res.json({out:true, message:'A Collection document was updated', data: col, create: false});
						} else {
							res.json({out:false, message:'An error on updating a record of Sample has been encountered!'});
						}
					});
				}
			})

		}
	}catch (err){
		console.log(err)
		res.json({out:false,message:'An exception has been thrown!'})
	}	
})

/////////////////////////////// Search Sample
router.get('/searchSample/:query',function(req,res, next){
	Sample.aggregate([
		{
			$match: { 
				c_id: parseInt(req.params.query)
			}
		}
	]).exec(function(err,cols){
		if (cols.length == 0){
			res.send({out:false, message:'No data is available for this query!'});
		} else {
			res.send({out:true, message:'Done', data: cols });
		}
	});
})

///////////////////////////////// CRUD for Sample
router.post('/CRUDsample',function(req,res, next){
	try{
		if (req.body.com === "delete"){
			console.log(req.body.data.id);
			Sample.deleteOne({id: req.body.data.id})
			.exec(function(err,cols){
				if(err) {
					res.json({out:false, message:'An Error on deleting the Sample document!'});	
				}
				if(!cols) { 
					res.json({out:false, message:'This record does not exist to be deleted!'});	
				} else {
					res.json({out:true, message:'A Sample document was deleted!'});	
				}
			})
		} else {
			Sample.findOne({id:req.body.data.id})
			.select('id').select('c_id').select('donor_count').select('mat_type').select('date')
			.exec(function(err,cols){
				if(err) {
					res.json({out:false, message:'An Error on updating/creating a sample document'});	
				}
				if(!cols) { // create new document
					var sample = new Sample({
						c_id: req.body.data.c_id,
						donor_count:req.body.data.donor_count,
						mat_type:req.body.data.mat_type
					})
					
					Sample.find().sort({ id: -1 }).limit(1) // find last document
					.exec((err,col)=>{
						let idv = 1;
						if (col[0]){
							idv = col[0].id + 1;
						}
						sample.id = idv;
						sample.save((error,coll)=>{
							if (!error){
								res.json({out:true, message:'A new record of Sample was created!', data: coll, create: true});
							} else {
								console.log(error);
								res.json({out:false, message:'An error on creating new record of Sample has been encountered!'});
							}
						});
					});

				} else { // update
					cols.donor_count = req.body.data.donor_count;
					cols.mat_type = req.body.data.mat_type;
					cols.save((error,col)=>{
						if (!error){
							res.json({out:true, message:'A Sample was updated', data: col, create: false});
						} else {
							res.json({out:false, message:'An error on updating a record of Sample has been encountered!'});
						}
					});	
				}
			})
		}
	}catch (err){
		console.log(err)
		res.json({out:false,message:'An exception has been thrown!'})
	}	
})

module.exports = router;