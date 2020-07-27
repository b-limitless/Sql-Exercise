
// Update document 
db.inventory.updateOne(
   { item: "paper" },
   {
     $set: { "size.uom": "cm", status: "P" },
     $currentDate: { lastModified: true }
   }
)

//Replace a Document

db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)

// Selecting specific fild with aliase as 

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  var dbo = db.db("wealthface2");
  dbo.collection("accounts").aggregate([{'$project':{accountNo:true, createdWhen:true, equity: true, cash:true, _id:false, mongo_id:"$_id"}}]).toArray(function(err, result) {
    if (err) throw err;
    result 
    console.log(JSON.stringify(result, null, 4))

    // Send it to elastic search 
    //fs.writeFileSync('test1.json', JSON.stringify(result));
    db.close();
  });
});

////////////////////////////////////////
// /////////////////////////////////////
///////////////////////////////////////
//https://docs.mongodb.com/manual/core/text-search-operators/

db.stores.createIndex( { name: "text", description: "text" } )

//Use the $text query operator to perform text searches on a collection with a text index.
db.stores.find(
   { $text: { $search: "coffee shop cake" } },
   { score: { $meta: "textScore" } }
).sort( { score: { $meta: "textScore" } } )


//Text Search in the Aggregation Pipeline
//Text Score¶
db.articles.createIndex( { subject: "text" } )

// Calculate the Total Views for Articles that Contains a Word
db.articles.aggregate(
   [
     { $match: { $text: { $search: "cake" } } },
     { $group: { _id: null, views: { $sum: "$views" } } }
   ]
)

//Return Results Sorted by Text Search Score

db.articles.aggregate(
   [
     { $match: { $text: { $search: "cake tea" } } },
     { $sort: { score: { $meta: "textScore" } } },
     { $project: { title: 1, _id: 0 } }
   ]
)

//Match on Text Score
db.articles.aggregate(
   [
     { $match: { $text: { $search: "cake tea" } } },
     { $project: { title: 1, _id: 0, score: { $meta: "textScore" } } },
     { $match: { score: { $gt: 1.0 } } }
   ]

//Specify a Language for Text Search

////////////////////////////////////////////
// Bulk Write Operations¶ ///
/////////////////////////////////////////////
// The characters collection contains the following documents:
{ "_id" : 1, "char" : "Brisbane", "class" : "monk", "lvl" : 4 },
{ "_id" : 2, "char" : "Eldon", "class" : "alchemist", "lvl" : 3 },
{ "_id" : 3, "char" : "Meldane", "class" : "ranger", "lvl" : 3 }

//The following bulkWrite() performs multiple operations on the collection:
try {
   db.characters.bulkWrite(
      [
         { insertOne :
            {
               "document" :
               {
                  "_id" : 4, "char" : "Dithras", "class" : "barbarian", "lvl" : 4
               }
            }
         },
         { insertOne :
            {
               "document" :
               {
                  "_id" : 5, "char" : "Taeln", "class" : "fighter", "lvl" : 3
               }
            }
         },
         { updateOne :
            {
               "filter" : { "char" : "Eldon" },
               "update" : { $set : { "status" : "Critical Injury" } }
            }
         },
         { deleteOne :
            { "filter" : { "char" : "Brisbane"} }
         },
         { replaceOne :
            {
               "filter" : { "char" : "Meldane" },
               "replacement" : { "char" : "Tanys", "class" : "oracle", "lvl" : 4 }
            }
         }
      ]
   );
}
catch (e) {
   print(e);
}

//The operation returns the following:

{
   "acknowledged" : true,
   "deletedCount" : 1,
   "insertedCount" : 2,
   "matchedCount" : 2,
   "upsertedCount" : 0,
   "insertedIds" : {
      "0" : 4,
      "1" : 5
   },
   "upsertedIds" : {

   }
}


// Delete one 
db.inventory.deleteOne( { status: "D" } )

// Delete many 
db.inventory.deleteMany({ status : "A" })

// Want to know about the security 
//https://docs.mongodb.com/manual/security/

// Find data by array any value in mongdob 
Permissions.find(
      { name: { $in: permissions } },
      { _id: true, name: true }
    );


// Not in query 
db.inventory.find( { qty: { $nin: [ 5, 15 ] } } )

// Use the $in Operator to Match Values¶
db.inventory.find( { qty: { $in: [ 5, 15 ] } } )



// Creating schema with relations Let say you have profile 
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  }
})

// This is user schema 
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})


// Now lets select from profile and inner join the user table 
// Amazing 
Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err))

// Find one and remove 
 Profile.findOneAndRemove({ user: req.user.id }).then(() => {})

 // Find one and update 
 Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    ).then(profile => res.json(profile))



/*
Then, the following update() operation will set the sale field value to 
true where the tags field holds an array 
with at least one element matching either "appliances" or "school".
*/

db.inventory.update(
                 { tags: { $in: ["appliances", "school"] } },
                 { $set: { sale:true } }
               )


//Use the $in Operator with a Regular Expression
db.inventory.find( { tags: { $in: [ /^be/, /^st/ ] } } )


//////////////////////////
// logical query operator 
//////////////////////////

// AND Queries With Multiple Expressions Specifying the Same Field
db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )

//AND Queries With Multiple Expressions Specifying the Same Operator¶
db.inventory.find( {
    $and: [
        { $or: [ { qty: { $lt : 10 } }, { qty : { $gt: 50 } } ] },
        { $or: [ { sale: true }, { price : { $lt : 5 } } ] }
    ]
} )

// Not 
db.inventory.find( { price: { $not: { $gt: 1.99 } } } )

// Not with regular expression 
db.inventory.find( { item: { $not: { $regex: "^p.*" } } } )


// Nor operator 
db.inventory.find( { $nor: [ { price: 1.99 }, { qty: { $lt: 20 } }, { sale: true } ] } )



// or
db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )


Auth.find({ updated_at: { $gt: new Date().getTime() - TET * 60 * 1000 } },{ access_token: true });


/* MONGOOSE MOST USED QUERY */
Model.deleteMany()
Model.deleteOne()
Model.find()
Model.findById()
Model.findByIdAndDelete()
Model.findByIdAndRemove()
Model.findByIdAndUpdate()
Model.findOne()
Model.findOneAndDelete()
Model.findOneAndRemove()
Model.findOneAndReplace()
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne()

// Check below link alot of good articles 
//https://mongoosejs.com/docs/discriminators.html