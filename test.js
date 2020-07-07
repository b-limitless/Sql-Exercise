// Update database my regular expression 
db.inventory.update({tags: {$in: ["application", "school"]}},
	{$set: {sale: false}});