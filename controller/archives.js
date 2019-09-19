const data = require('./data')
const readlines = require('./readlines')
const validator = require('./validation')

exports.index = function(request, response, next) {
    return response.render('archives.ejs')
}

exports.all = async (request, response, next) => {
    if (request.query.page)
        var page = request.query.page;
    else
        var page = 1
    var archives;
    await data.getArchives(page).then(
        async function(result) {
            archives = result;
            await data.getAmountOfArchives().then(count => {
                response.json({archives, count})
            });
        },
        error => {
            return response.json({message: `error: ${error}`})
        }
    )
}

exports.archive = async(request, response) => {
    response.render('archive.ejs');
}

exports.getArchive = async(request, response) => {
    let id = request.query.id
    await data.getArchiveById(id.toString()).then(
        result => {
            response.json(result);        
        },
        error => {
            response.send(`error: ${error}`);
        }
    )
}

exports.getLines = async(req, res) => {
    let lineNumber = req.query.lines,
        id = req.query.id,
        lines = []
    if (validator.isValidNumberOfLines(lineNumber)) {
        await data.getArchiveById(id).then(
            async function(result) {
                lines = await readlines.lines(result, lineNumber)
                res.json({lines});    
            }
        ).catch(
            error => {
                throw error;
                //res.send(`error: ${error}`);
            }
        )
    }
    else
        res.send({error: 'Invalid number of lines'})
    
}