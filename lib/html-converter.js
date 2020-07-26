var fs  = require("fs");

class HTMLConverter {
	constructor(outputFile) {
        this._outputFile = outputFile || null
        
        if (this._outputFile) this.Setup();
	}
    get outputFile() { return this._outputFile }
    set outputFile(val) { this._outputFile = val; this.Setup(); }

	
	_writeLine(line, hClass){
		var htmlClass = "";
		if (hClass) htmlClass = "class='" + hClass + "'";
		var out = "<div " + htmlClass + ">" + line.toString() + "</div>";

		fs.appendFileSync(outputFile, out + "\n");
	}

	Setup() {  
		// Delete file if it exists
		try {
			fs.unlinkSync(outputFile)
		} catch (e) {
			if (!e.errno === -2) console.log(e)
		}

		// Setup file
		fs.createReadStream('./htmlheader.txt').pipe(fs.createWriteStream(outputFile));


	}
	Cleanup() {
		writeLine("&nbsp;", 'spacer')

		fs.appendFileSync(outputFile, "</body> \n");
		fs.appendFileSync(outputFile, "</html> \n");
	}


	// Metadata
	Title(line) { writeLine(line.trim(), 'titlePage title'); }
	SubTitle(line) { writeLine(line.trim(), 'titlePage issueTitle'); }

	Author(line) { writeLine(line.trim(), 'titlePage'); }
	Contact(line) { writeLine(line.trim(), 'spacer'); }

	Blurb(line) { writeLine(line.trim(), 'titlePage'); }
	Description(line) { writeLine(line.trim(),'titlePage'); }

	Version(line) { writeLine("Version: " + line.trim(), 'spacer titlePage'); }
	Status(line) { writeLine(line.trim(), 'spacer titlePage'); }
	PublishDate(line) { writeLine(line.trim(), 'titlePage'); }



	// Default
	StandardLine = function(line) { writeLine(line, 'bold'); }

	BlankLine = function() { writeLine("&nbsp;") }

	Heading(line, level) { writeLine(`<h${level}>${line}</h${level}>`); }

	Quote = function(line) { writeLine(line, 'quote'); }
	Quoter = function(line) { writeLine(line, 'quoter'); }

	Comment(line) { writeLine(line, 'comment'); }

	PrivateNote(line) { line = "[[" + line + "]]"; writeLine(line, 'private'); }




}

