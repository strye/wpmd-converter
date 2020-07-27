

class JsonProcessor {
    static setConverter(type = "html", outputFile) {
        let converter = null;
    
        switch(type.toLowerCase()) {
            case "html": converter = require("./html-converter"); break;
            // case "pdf": converter = new require("./pdf-converter")(outputFile); break;
            // case "docx": converter = new require("./docx-converter")(outputFile); break;
            // case "md": converter = new require("./md-converter")(outputFile); break;
            default: type = "html"; converter = require("./html-converter");
        }
    
        return new converter(outputFile);
    }

    constructor(options) {
        this._type = options.type || "html";
        this._outputFile = options.outputFile || "content.html";
        this._commentsOn = options.commentsOn || false;
        this._converter = null;
    }
    get type() { return this._type }
    set type(val) { this._type = val; }

    get outputFile() { return this._outputFile }
    set outputFile(val) { this._outputFile = val; }

    get commentsOn() { return this._commentsOn }
    set commentsOn(val) { this._commentsOn = val; }

    get converter() { return this._converter }

    loadConverter() {
    }
    processContentJson(content) {
        let self = this;
        return new Promise(function (resolve, reject){
            try {
                self._converter = JsonProcessor.setConverter(self._type, self._outputFile);
                self._converter.Setup().then(function(){

                    self.writeMeta(content.meta)
    
                    content.content.forEach(line => {
                        self.writeLine(line, self.commentsOn);
                    });
        
                    self._converter.Cleanup();
                    return resolve(true);
    
                });
            } catch (error) {
                reject(error);
            }
        })

    }

    writeLine(line, commentsOn) {
        let conv = this._converter;
        line.text = line.text.trim();
        switch (line.type) {
            case "heading": conv.Heading(line.text, line.level); break;
            case "quote": conv.Quote(line.text); break;
            case "quoter": conv.Quoter(line.text); break;
            case "image": break;
            case "bullet": break;
            case "list": break;
            case "comment": if (commentsOn) conv.Comment(line.text); break;
            // case "private": if (mode === 'f') conv.PrivateNote(line.text); break;
            default: conv.StandardLine(line.text); break;
        }				
    
    }
 
    writeMeta(meta) {
        let conv = this._converter;

        if (meta.title) { conv.Title(meta.title); }
        if (meta.issueNo) { conv.IssueNumber(meta.issueNo); }
        if (meta.subTitle) { conv.SubTitle(meta.issueTitle); }
        if (meta.description) { conv.Description(meta.description); }
        if (meta.author) { conv.Author(meta.author); }
        if (meta.version && conv.Version) { conv.Version(meta.version); }
        if (meta.draft) { conv.DraftInfo(meta.draft); }
        if (meta.contact) { conv.Contact(meta.contact); }
    }
    




}


module.exports = JsonProcessor
