const tar = require('tar-stream')
const fs = require('fs')
const zlib = require('zlib')
const readline = require('readline')

exports.lines = async function(archive, numberLines){
    return new Promise(function(resolve, reject){
        try {
            var extract = tar.extract()
            let line_no = 0,
                lines = []
            extract.on('entry', function(header, stream, next) {
                let rl = readline.createInterface({
                    input: stream
                })
                rl.on('line', function(line){
                    line_no++
                    lines.push(line);
                    if (line_no == numberLines) {
                        rl.pause()
                        rl.close()
                        rl.removeAllListeners()
                        resolve(lines)
                    }
                })

                stream.on('end', function() {
                    next()
                })

                stream.on('finish', function(){
                    resolve(lines)
                })

                stream.resume()
            })
        
            fs.createReadStream("./storage/" + archive.title)
                .pipe(zlib.createGunzip())
                .pipe(extract);
            }
         catch(err) {
            reject(err)
        }
    })
}