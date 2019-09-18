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

exports.getArchives = async function(){
    return new Promise(function(resolve, reject){
        Archive.find({}, function(err, doc) {
            if (err)
                throw err;
            resolve(doc);
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