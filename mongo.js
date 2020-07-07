db.collection("accounts").aggregate([{'$project': {accountNo: true, mongod_id:"$_id"}}])
Usercarforsale.find({
	category_parent: 'motercyles',
	payment_status: 'success'
})
 .distinct('category_parent1')
 .pupulate('category_parent1')
 .exe(function(err, users) {
 	if(err) return res.status(404).json(error);
 })

 UserCarforsale.findOneAndUpdate({
 	{_id: req.body.product_id},
 	{$set: {payment_status: req.body.payment_status}},
 	{new: true, useFindAndModify: false}
 ).then(updated => {
 	return res.status(200).send(savedDate)
 })

 let {
 	emirate,
 	category
 }

 // query with regular expression 
 let query = {
 	category: category,
 	category_parent = category_parent,
 	'locate_your_car.description': {$regex: new RegExp(emirate, 'i')},
 	payment_status: 'success'
 }

 // Check price 
 if(!isNan(price)) {
 	if(price !== '') {
 		query.price = {$lt: price};
 	}
 }

 // Checking model 
 if(model == undefined || model === '') {

 } else {
 	query['model.value'] = model;
 }

 let yearSearch = {};

 if(!isNan(yearfrom)) {
 	if(yearfrom !== '') {
 		yearSearch['$gt'] = yearfrom;
 	}
 }

 //checking category parent 
 if(typeof category_parent1 !== 'undefined' && category_parent1 !== '') {
 	query.category_parent1 = category_parent1;
 }

 // Year to 
 if(!isNan(yearto)) {
 	if(yearto !== '') {
 		yearSearch['$lt'] = yearto;
 	}
 }

 if(Object.keys(yearSearch).length > 0) {
 	query['year.value'] = yearSearch;
 }

 page = page === undefined ? 0 : page -1;

 let skip = page * perpage;

 // Selected filed 
 UsedCarforSale(query, {_id; true}).count(function(err, count) {
 	if(err) return res.status(500).json(err);

 	Usercarforsale.find(query, selectfields)
 	 .limit(perpage)
 	 .skip(skip)
 	 .then(searched => {
 	 	
 	 })
 })