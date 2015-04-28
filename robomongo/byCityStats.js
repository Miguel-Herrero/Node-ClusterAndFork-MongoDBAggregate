db.getCollection('population').aggregate([
    { $unwind: "$population" },
    { $group: {
        _id: {
            city: "$city",
            timestamp: "$timestamp",
        },
        "root": { $push: "$$ROOT" },
        "maxAge": { $max: "$population.age" },
        "minAge": { $min: "$population.age" },
        "avgAge": { $avg: "$population.age" },
        "sumPopulation": { $sum: "$population.count" }
    } },
    { $sort: { "_id.timestamp": 1 } },
    { $unwind: "$root" },
    { $project: {
        _id: {
            city: "$_id.city",
            timestamp: "$_id.timestamp",
            maxAge: "$maxAge",
            minAge: "$minAge",
            avgAge: "$avgAge",
            sumPopulation: "$sumPopulation"
        },
        //root: "$root"
    }},
    { $group: {
        _id: "$_id"
    }}
]);