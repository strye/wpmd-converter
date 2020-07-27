let jsonProcessor = require("./lib/json-processor"),
fileReader = new require("./lib/file-reader");

class CMSConverter {

    static processFile(file, outputFile, commentsOn = false) {
        let outputOptions = {type: "html", outputFile: outputFile, commentsOn: commentsOn},
        jsonProc = new jsonProcessor(outputOptions),
        fileProc = new fileReader();
    
        // Read file
        fileProc.read(file)
        .then(function(content) {
            console.log(content);
            jsonProc.processContentJson(content)
            .then(function(opts){
                console.log(opts)
            })
        })
    
    }

}


module.exports = CMSConverter;