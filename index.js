let jsonProcessor = require("./lib/json-processor"),
readLines = require("./lib/read-file");

class CMSConverter {

    static get Processor() { return processor; }

    static get FileProcessor() { return fileProcessor; }

    static get ReadLines() { return readLines; }

    static get ConverterFactory() { return converterFactory; }


    static processFile(file, outputFile, commentsOn) {
        let outputOptions = {type: "html", outputFile: outputFile, commentsOn: false},
        jsonProc = new jsonProcessor(outputOptions)
    
        // Read file
        readLines(file)
        .then(function(content) {	
            jsonProc.processContentJson(content)
            .then(function(opts){
                console.log(opts)
            })
        })
    
    }

}


export default CMSConverter;