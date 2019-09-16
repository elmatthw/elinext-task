const fs = require('fs')
const Archive = require('../model')

async function deleteArchive(archive) {
    try {
        fs.unlink('./storage/' + archive.title).then(
            async function() {
                deleteArchiveFromDatabase(archive._id)
            }
        )

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

async function getClosestDate(){
    Archive.
        find({}).
        where('expire').lte(new Date().toISOString())
        sort('-expire').
        select('_id, title, expire').
        exec(function(err, archives){
            Promise.all(
                archives.map(async function(archive) {
                    /* if 
                    setTimeout(deleteArchive, new Date(), archive) */
                    }
                )
            )
            archives.array.forEach(element => {
                
            });
        })
}

setTimeout(deleteArchive, time, archive)