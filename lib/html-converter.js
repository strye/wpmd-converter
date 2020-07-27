var fs  = require("fs");

class HTMLConverter {
	constructor(outputFile) {
        this._outputFile = outputFile || null;
        this._streamWriter = null;
        
        //if (this._outputFile) this.Setup();
	}
    get outputFile() { return this._outputFile }
    set outputFile(val) { this._outputFile = val; this.Setup(); }

	
	_writeLine(line, hClass){
		var htmlClass = "";
		if (hClass) htmlClass = "class='" + hClass + "'";
		var out = "<div " + htmlClass + ">" + line.toString() + "</div>";

		this._streamWriter.write(out + "\n");
	}

	Setup() {  
        let self = this;
        return new Promise(function (resolve, reject){
            // Delete file if it exists
            try {
                fs.unlinkSync(self._outputFile)
            } catch (e) {
                if (!e.errno === -2) {console.log(e); reject(e)}
            }

            // Setup file
            self._streamWriter = fs.createWriteStream(self._outputFile);
            fs.createReadStream('./htmlheader.txt').pipe(self._streamWriter);
            self._streamWriter.on('finish', function(){
                self._streamWriter = fs.createWriteStream(self._outputFile, {flags: 'a'});
                resolve();
            });

            //this._streamWriter = fs.createReadStream('./htmlheader.txt').pipe(fs.createWriteStream(this._outputFile));

        })
    }
	Cleanup() {
		this._writeLine("&nbsp;", 'spacer')

        this._streamWriter.write("</body> \n");
		this._streamWriter.write("</html> \n");
    }


	// Metadata
	Title(line) { this._writeLine(line.trim(), 'titlePage title'); }
	SubTitle(line) { this._writeLine(line.trim(), 'titlePage subTitle'); }

	Author(line) { this._writeLine(line.trim(), 'titlePage'); }
	Contact(line) { this._writeLine(line.trim(), 'spacer'); }

	Blurb(line) { this._writeLine(line.trim(), 'titlePage'); }
	Description(line) { this._writeLine(line.trim(),'titlePage'); }

	Version(line) { this._writeLine("Version: " + line.trim(), 'spacer titlePage'); }
	Status(line) { this._writeLine(line.trim(), 'spacer titlePage'); }
	PublishDate(line) { this._writeLine(line.trim(), 'titlePage'); }



	// Default
	StandardLine = function(line) { this._writeLine(line); }

	BlankLine = function() { this._writeLine("&nbsp;") }

	// Heading(line, level) { this._writeLine(`<h${level}>${line}</h${level}>`); }
	Heading(line, level) { this._writeLine(line, `heading${level}`); }

	Quote = function(line) { this._writeLine(line, 'quote'); }
	Quoter = function(line) { this._writeLine(line, 'quoter'); }

	Comment(line) { this._writeLine(line, 'comment'); }

	PrivateNote(line) { line = "[[" + line + "]]"; this._writeLine(line, 'private'); }

}

module.exports = HTMLConverter

