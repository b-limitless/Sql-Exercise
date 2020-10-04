db.collection("accounts").aggragate([{'$project' : {accountNo: }}]).distinct('filedname').pupulate('category_parent').exe(
	function(err, users) {
		if(err) return res.status(404).json(error)
	})

Model.deletMany()
Model.deleteOne()
Model.find()
Model.findOneAndUpdate()
Model.findOneAndDelete()
Model.findOne()
Model.findOneAndDelete()
Model.replaceOne()
Model.updateMany()
Model.updateOne()

db.inventory.updateOne({item: 'paper'}, {$set: {"size.com": "cm", status: true}})
db.inventory.replaceOne({item: 'paper'}, {item: "paper" ,instock: [{}]});

// Connecting mongodb with useNewUrlParser 
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopplogy: true} , function(connection => {

}))

db.createIndex({name: 'text', description: "text"});

// text search find 
db.stores.find({$text: {$search: "coffe shop cake"}},
	{score: {$meta: "textScore"}}).sort({score:{$meta: "textScore"}});

db.articles.aggregate([{
	$match: {$text: {$search: "cack"}}
}])