const Archive = require('../model')

exports.getArchiveById = async function(id){
    return await new Promise(function(resolve, reject){
        Archive.findById(id, function(err, doc) {
            if (err)
                throw err;
            resolve(doc)
            
        })
    })
}

exports.saveArchive = async function(archive){
    archive.save(function(err){
        if (err) {
            console.log(err);
            throw err;
        }
        console.log('saved to db');
    })
}

exports.getArchives = async function(page){
    return new Promise(function(resolve, reject){
        Archive.find({}).
            skip((page - 1) * 5).
            limit(5).
            exec(function(err, doc) {
            if (err)
                throw err;
            resolve(doc);
        })
    })
}

exports.getAmountOfArchives = async function(){
    return new Promise(function(resolve, reject){
        Archive.countDocuments({}, function(err, count) {
            if (err)
                throw err;
            resolve(count);
        })
    })
}

exports.deleteArchiveFromDatabase = async function(id){
    Archive.findByIdAndRemove(id, function(err, data){
        if (!err) {
            console.log('deleted')
        }
    })
}