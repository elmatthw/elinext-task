exports.isValidExtension = function(filename){
    return filename.match(/(\.gz)$/)
}

exports.isValidDate = function(date, time){
    if (new Date(date + " " + time) < new Date())
        return false
    return date.match(/^((0[1-9]|1[0-2])\.(0[1-9]|1\d|2\d|3[01])\.[12]\d[1-9][0-9])$/) 
        && time.match(/^(([01]\d|2[0-3])\:[0-5]\d)$/)
}

exports.isValidNumberOfLines = function(lines) {
    return lines.match(/^([1-9]+\d*)$/)
}