let lineParse = require("./line-parse");

class FileReader {
    static titleCase = function(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            if (word.startsWith("(") | word.endsWith(")")) {
                return word.toUpperCase()
            }
            //return word.replace(word[0], word[0].toUpperCase());
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
    
	constructor() {
		this._fileLines = []
		this._fileResults = {
			meta: {},
			content: [],
			lineCount: 0,
			wordCount: 0
        }
    
	}

	read(file) {
        let self = this,
        parseVars = {
            metaOn: false,
            commentOn: false
        };

		return new Promise(function (resolve, reject){
			// read file line by line
			var lineReader = require('readline').createInterface({
				input: require('fs').createReadStream(file)
			});
	
			lineReader.on('line', function (line) {
				let res = self.parseLine(line.trim(), parseVars);
				if (res) {
					this._fileResults.lineCount++;
					this._fileResults.wordCount += res.wordCnt;

					if (res.type === "meta") {
						this._fileResults.meta[line.attr] = line.text;
					} else {
						this._fileResults.content.push(res);
					}
				}
			});
	
			lineReader.on('close', function () {
				return resolve(this._fileResults);
			});
	
		});
    }
    
    parseLine(line, parseVars) {
        let res = null;
	
        // Comments
        if (line.startsWith('/*')) parseVars.commentOn = true;
        if (parseVars.commentOn || line.startsWith('//') || line.startsWith('!==')) {
            // look for the comment clossing key
            var comm = line;
            if (line.startsWith('//') | line.startsWith('/*')) comm = line.substr(2)
            if (line.endsWith('*/')) {
                let strt = 0;
                if (line.startsWith('//') | line.startsWith('/*')) strt = 2
                let lng = (line.length - (2 + strt))
                comm = line.substr(strt, lng)
                parseVars.commentOn = false;
            }
    
            if (comm.trim().length > 0)
            res = { type: 'private', text: comm.trim() }
        }
    
        // else if (line.startsWith("-----") && parseVars.metaOn) {parseVars.metaOn = false}
        // else if (line.startsWith("-----") && !parseVars.metaOn) {parseVars.metaOn = true}
        else if (line.startsWith("-----")) {parseVars.metaOn = !parseVars.metaOn}
    
    
        // Metadata Section
        else if (parseVars.metaOn) {
            var lineUpper = line.toUpperCase().trim();
            if (lineUpper.startsWith('TITLE:')) {
                res = { type: 'meta', text: line.substr(6).trim(), attr: "title" }
            }
            if (lineUpper.startsWith('ISSUE:')) {
                res = { type: 'meta', text: "Issue #: " + line.substr(6).trim(), attr: "issueNo" }
            }
            if (lineUpper.startsWith('ISSUE TITLE:')) {
                res = { type: 'meta', text: "Title: \"" + line.substr(12).trim() + "\"", attr: "issueTitle" }
            }
            if (lineUpper.startsWith('CREDIT:')) {
                res = { type: 'meta', text: line.substr(7).trim(), attr: "credit" }
            }
            if (lineUpper.startsWith('AUTHOR:')) {
                res = { type: 'meta', text: line.substr(7).trim(), attr: "author" }
            }
            if (lineUpper.startsWith('DRAFT DATE:')) {
                res = { type: 'meta', text: line.substr(11).trim(), attr: "draft" }
            }
            if (lineUpper.startsWith('VERSION:')) {
                res = { type: 'meta', text: line.substr(8).trim(), attr: "version" }
            }
            if (lineUpper.startsWith('CONTACT:')) {
                res = { type: 'meta', text: line.substr(8).trim(), attr: "contact" }
            }
            if (lineUpper.startsWith('SCRIPT DESCRIPTION:')) {
                res = { type: 'meta', text: line.substr(19).trim(), attr: "description" }
            }
            if (lineUpper.startsWith('WRITER:')) {
                res = { type: 'meta', text: "Written by " + line.substr(7).trim(), attr: "writer" }
            }
            if (lineUpper.startsWith('STORY BY:')) {
                res = { type: 'meta', text: "Story by " + line.substr(9).trim(), attr: "story" }
            }
        }
    
    
    
        else if (line.charAt(0) === "#" ) {
            let lvl = 6, parse = true;
            [1,2,3,4,5,6].forEach(cnt => {
                if (parse && line.charAt(cnt) != "#") { lvl = cnt; parse = false; }			
            });
    
            res = { type: 'heading', level: lvl, text: line.substr(lvl) }
        }
    
    
    
        
        // Test for start of character dialog
        else if (line.startsWith('>') && line.charAt(1) != ">") {
            res = { type: 'quote', text: line.substr(1).trim() }
        } 
    
        // Quote Attribution
        else if (line.startsWith('>>') && line.charAt(2) != ">") {
            res = { type: 'quoter', text: line.substr(2).trim }
        } 
    
        
        // Default
        else if (line && line.length>0) {
            res = { type: 'standard', text: line }
        }
    
        return res;
    
    }
}

