const fs = require('fs')
const Archive = require('../../model')
const data = require('../../controller/data')
const queueMap = new Map()

function archiveIsInQueue(id){
    return queueMap.has(id)
}

exports.findExpired = function(req, res, next){
    Archive.
        find({}).
        where('expire').lte(new Date().toISOString()).
        sort({expire: -1 }).
        select('_id title expire').
        exec(async function(err, archives){
            await deleteArchive(archives);
        })
    next()
}

exports.findClosestToExpire = function(req, res, next){
    Archive.
        find({}).
        limit(1).
        sort('-expire').
        select('expire').
        exec(function(err, archives){
            if (archives.length !== 0) {
                var closestDate = archives[0].expire;
                Archive.
                    find({}).
                    where('expire').equals(closestDate).
                    select('_id title expire').
                    exec(function(err, archives) {
                        if (archives) {
                            archives.forEach(function(archive) {
                                if (new Date(closestDate) - new Date() < Math.pow(2, 31) - 1 && !archiveIsInQueue(archive._id.toString())) {
                                    var timeoutId = setTimeout(deleteArchive, new Date(closestDate) - new Date(), archives)
                                    queueMap.set(archive._id.toString(), timeoutId)    
                                }
                            });
                        }
                    })
            }
            
        })
    next()
}
 
async function deleteArchive(archives) {
    try {
        archives.forEach(function(archive) {
            fs.unlinkSync('./storage/' + archive.title)
            data.deleteArchiveFromDatabase(archive._id)
        })
    }
    catch (err) {
        console.log(err)
    }
}