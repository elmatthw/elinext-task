const fs = require('fs')
const Archive = require('./model')

console.log('required')

const queueMap = new Map()

function archiveIsInQueue(id){
    console.log(queueMap.has(id))
    return queueMap.has(id)
}

exports.findExpired = function(req, res, next){
    console.log('in expired')
    Archive.
        find({}).
        where('expire').lte(new Date().toISOString()).
        sort({expire: -1 }).
        select('_id title expire').
        exec(async function(err, archives){
            console.log(archives)
            await deleteArchive(archives);
            /* Promise.all(
                archives.map(async function(archive) {
                        
                    }
                )
            ) */
        })

    next()
}

exports.findClosestToExpire = function(req, res, next){
    console.log('in closest to expired')
    Archive.
        find({}).
        limit(1).
        sort('-expire').
        select('expire').
        exec(function(err, archives){
            var closestDate = archives[0].expire;
            Archive.
                find({}).
                where('expire').equals(closestDate).
                select('_id title expire').
                exec(function(err, archives) {
                    if (archives) {
                        var timeoutId = setTimeout(deleteArchive, new Date(closestDate) - new Date(), archives)
                        console.log('timeout is set ' + timeoutId)
                        archives.forEach(function(archive) {
                            console.log(queueMap.entries())
                            if (!archiveIsInQueue(archive._id)) {
                                queueMap.set(archive._id, timeoutId)    
                                console.log('another timeout added')
                            }

                        });
                    }
                })
        })

    next()
}
 
// TODO: make delete more effective: NOT deleting one element from database at a time

async function deleteArchive(archives) {
    try {
        archives.forEach(function(archive) {
            fs.unlinkSync('./storage/' + archive.title)
            deleteArchiveFromDatabase(archive._id)
        })
    }
    catch (err) {
        console.log(err)
    }
}

async function deleteArchiveFromDatabase(id){
    Archive.findByIdAndRemove(id, function(err, data){
        if (!err) {
            console.log('deleted')
        }
    })
}