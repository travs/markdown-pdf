var fs = require("fs");
var pdf = require('html-pdf');
var path = require('path');
var url = require('url');
var mdpreview = atom.packages.activePackages["markdown-preview"];

module.exports = {

  config: {
    "format": {
      "title": "Page Format",
      "type": "string",
      "default": "A4",
      "enum": ["A3", "A4", "A5", "Legal", "Letter", "Tabloid"]
    },
    "orientation": {
      "title": "Page Orientation",
      "type": "string",
      "default": "portrait",
      "enum": ["portrait", "landscape"]
    },
    "timeout": {
      "title": "Timeout",
      "description": "Time (ms) before PhantomJS gives up on rendering. You can set a larger value for very big files.",
      "type": "integer",
      "default": 10000
    },
    "border": {
      "title": "Border Size",
      "type": "string",
      "default": "10mm"
    },
    "type": {
      "title": "Exported Filetype",
      "type": "string",
      "default": "pdf",
      "enum": ["pdf", "png", "jpeg"]
    },
    "quality": {
      "title": "Image Quality",
      "description": "Only used for .png and .jpeg formats.",
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "default": 100
    }
  },

  activate: function() {
    atom.commands.add('atom-workspace', 'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    try{
      outPath = getOutputPath();
      htmlFromPreview(function(html){
        html = convertImgSrcToURI(html);
        html = getStyledHtml(html);

        // Ugly Fix 1:
        base64hr = 'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OENDRjNBN0E2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OENDRjNBN0I2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Q0NGM0E3ODY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Q0NGM0E3OTY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqqezsUAAAAfSURBVHjaYmRABcYwBiM2QSA4y4hNEKYDQxAEAAIMAHNGAzhkPOlYAAAAAElFTkSuQmCC';
        html = html.split('"atom://markdown-preview/assets/hr.png"').join('"data:image/png;base64,' + base64hr + '"');

        // Ugly Fix 2:
        html = html.split(',\n:host {').join(' {');
        html = html.split(',\n:host').join(',');
        html = html.split(':host').join('');

        makePdf(html, outPath);
      });
    }
    catch(err){
      console.log(err);
      return;
    }
  }
}

function htmlFromPreview(callback){
  //render markdown using Atom's Markdown-Preview package
  var cb = atom.clipboard;
  if(editorSelected()){
    //save old clipboard contents
    var old = cb.read();
    //get html on clipboard
    mdpreview.mainModule.copyHtml();

    var html = cb.read();
    //put old clipboard contents back
    cb.write(old);
    callback(html);
  }
  else alert('Please select the editor containing the markdown you wish to convert.');
}

function getStyledHtml(input){
  return getStyles() + wrapHtml(input);
}

function wrapHtml(input){
  return '<body class="markdown-preview native-key-binding">' + input + '</body>';
}

function getStyles(){
  var styles = {};
  var mdpreview = atom.packages.activePackages["markdown-preview"];

  styles.previewStyles = mdpreview.stylesheets[0][1];
  styles.syntaxStyles = atom.themes.getActiveThemes()[0].stylesheets[0][1];
  styles.uiStyles = atom.themes.getActiveThemes()[1].stylesheets[0][1];
  if(fs.existsSync(atom.styles.getUserStyleSheetPath(), 'utf8')){
    //add user stylesheet to html if it exists
    styles.userStyles = fs.readFileSync(atom.styles.getUserStyleSheetPath(), 'utf8');
  }

  var styleString = '';
  for(var s in styles){
    styleString += '<style>' + styles[s] + '</style>';
  }
  return styleString;
}

function makePdf(inputHtml, outputPath){
  pdf.create(inputHtml, getConfig(), function(err, buffer) {
    if (err) {
      alert("Error converting to image format. Check console for more information.");
      console.log(err + "\nIf the error is a timeout, try running the command again.");
    }
    fs.writeFile(outputPath, buffer);
    console.log("Converted successfully. Output in " + outputPath);
  });
}

function getConfig(){
  //get current configuration settings for this package
  return atom.config.get('markdown-pdf');
}

function convertImgSrcToURI(html){
  //input: full html document
  //output: same html document with all "img src" in URI form (i.e. "file://")
  var div = document.createElement('div');
  div.innerHTML = html;
  var imgs = div.getElementsByTagName('img');
  for(var s = 0; s < imgs.length; s++){
    imgs[s].src = processSrc(imgs[s].attributes.src.value);
  }
  return div.innerHTML;
}

function processSrc(src){
  //make a local img src path into a "file:///absolute/path/" if it isn't already

  if(url.parse(src).protocol){
    //if the src already starts with "file://", "https://", etc., it's already in the right form (URI)
    return src;
  }
  else if(path.resolve(src) !== src){
    //if path is not absolute and has no protocol, it should be relative, so make it a URI
    src = path.resolve(path.dirname(outPath), src);
    return 'file:///' + src;
  }
  else{
    //otherwise, the src is an absolute path. In this case we can just prepend "file://" to it
    return 'file:///' + src;
  }
}

function getOutputPath(){
  var markdownPath = atom.workspace.activePaneItem.getPath();
  if (!isMd(markdownPath)){
    //file is saved as something other than markdown-type file
    throw 'Please save the file as a markdown (.markdown, .md, .mkd, .mkdown or .ron)';
  }
  else if (!markdownPath){
    //file is unsaved

    //get directory selected in tree-view
    var treeDirPath = atom.packages.getActivePackage('tree-view').mainModule.treeView.selectedPath;
    if(!fs.lstatSync(treeDirPath).isDirectory()){
      treeDirPath = path.dirname(treeDirPath);
    }

    var d = new Date();
    var outName = d.getTime() + '.' + atom.config.get('markdown-pdf.type');
    var outputPath = path.join(treeDirPath, outName);
    return outputPath;
  }
  else{
    //file is saved as markdown type
    var out = markdownPath.replace(getExtension(markdownPath), atom.config.get('markdown-pdf.type'));
    return out;
  }
}

function editorSelected(){
  if(atom.workspace.getActiveTextEditor() !== undefined) return true;
  return false;
}

function isMd(path){
  //if file is unsaved, return true and convert it anyway (see issue #13 in repo)
  if(!path) return true;

  //check extension of current file if it's saved
  var accepted = ["markdown", "md", "mkd", "mkdown", "ron"];
  var current = path.split(".").pop();
  if(accepted.indexOf(current) != -1) return true;
  return false;
}

function getExtension(path){
  var ex = path.split('.').pop();
  return ex;
}
