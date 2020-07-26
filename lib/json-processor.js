

class JsonProcessor {
    static setConverter(type = "html", outputFile) {
        let converter = null;
    
        switch(self.type.toLowerCase()) {
            case "html": converter = new require("./html-conv")(outputFile); break;
            // case "pdf": converter = new require("./pdf-conv")(outputFile); break;
            // case "docx": converter = new require("./docx-conv")(outputFile); break;
            // case "md": converter = new require("./md-conv")(outputFile); break;
            default: type = "html"; converter = new require("./html-conv")(outputFile);
        }

        // switch(self.type.toLowerCase()) {
        //     case "pdf": converter = new pdfConv(options); break;
        //     case "docx": converter = new docxConv(options); break;
        //     case "html": converter = new htmlConv(options); break;
        //     case "md": converter = new txtConv(options); break;
        //     default: type = "html"; self.converter = new htmlConv(options);
        // }
    
        return converter;
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
        return new Promise(function (resolve, reject){
            try {
                this._converter = FileProcessor.setConverter(this._type, this._outputFile);

                this.writeMeta(content.meta)
    
                content.content.forEach(line => {
                    this.writeLine(line, commentsOn);
                });
    
                converter.Cleanup();
                return resolve(outputOptions);
            } catch (error) {
                reject(error);
            }
        })

    }

    writeLine(line, commentsOn) {
        let conv = this._converter;
        line.text = line.text.trim();
        switch (line.type) {
            case "heading": conv.Heading("", line.number, line.panels); break;
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
        if (meta.issueTitle) { conv.IssueTitle(meta.issueTitle); }
        if (meta.description) { conv.Description(meta.description); }
        if (meta.author) { conv.Author(meta.author); }
        if (meta.version && conv.Version) { conv.Version(meta.version); }
        if (meta.draft) { conv.DraftInfo(meta.draft); }
        if (meta.contact) { conv.Contact(meta.contact); }
    }
    




}


module.exports = JsonProcessor
