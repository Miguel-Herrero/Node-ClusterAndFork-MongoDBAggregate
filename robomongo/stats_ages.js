db.getCollection('population').aggregate([
    { $unwind: "$population" },
    { $group: {
        _id: { timestamp: "$timestamp", city: "$city" },
        totalPeople: { $sum: "$population.count" },
        maxAge: { $max: "$population.age" },
        maxAge_city: { $min: "$city" },
        minAge: { $min: "$population.age"  },
        avgAge: { $avg: "$population.age" },
        root: { $first: "$$ROOT" }
    } },
    { $sort: { "_id.timestamp": 1 } },
    { $sort: { "totalPeople": 1,  } },
    { $group: {
        _id: null,
        totalPeopleRegistered: { $sum: "$totalPeople" },
        maxNumberOfPeopleRegistered: { $max: "$totalPeople" },
        maxNumberOfPeopleRegistered_city: { $last: "$_id.city"},
        minNumberOfPeopleRegistered: {$min: "$totalPeople" },
        minNumberOfPeopleRegistered_city: {$first: "$_id.city"},
        averageNumerOfPeopleRegistered: { $avg: "$totalPeople" },
        _____: { $max: "____" },
        maxAgeRegistered: { $max: "$maxAge" },
        //maxAgeRegistered_city_ENQUECIUDADHAYESTAEDAD: {$max: "$maxAge_city" },
        minAgeRegistered: { $min: "$minAge" },
        averageAgeRegistered: { $avg: "$avgAge" },
        root: { $push: "$root" }
    }},
    { $project: {
        _id: "$_id",
        stats: {
            totalPeopleRegistered: "$totalPeopleRegistered",
            maxNumberOfPeopleRegistered: "$maxNumberOfPeopleRegistered",
            maxNumberOfPeopleRegistered_city: "$maxNumberOfPeopleRegistered_city",
            minNumberOfPeopleRegistered: "$minNumberOfPeopleRegistered",
            minNumberOfPeopleRegistered_city: "$minNumberOfPeopleRegistered_city",
            averageNumerOfPeopleRegistered: "$averageNumerOfPeopleRegistered",
            _____: "$____" ,
            maxAgeRegistered: "$maxAgeRegistered",
            maxAgeRegistered_city_ENQUECIUDADHAYESTAEDAD: "$maxAgeRegistered_city_ENQUECIUDADHAYESTAEDAD",
            minAgeRegistered: "$minAgeRegistered",
            averageAgeRegistered: "$averageAgeRegistered"
        },
        root: "$root"
    } },
    //{ $unwind: "$root"},
    { $project: {
        _id: "$stats",
        root: "$root"
    }},
    { $group: {
        _id: "$_id",
        age: {$last: "$root.population"}
    }}

]);