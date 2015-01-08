var fs = require("fs");
var marked = require('marked');
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
    atom.workspaceView.command('markdown-pdf:convert', this.convert);
  },

  convert: function() {
    try{
      outPath = getOutputPath();
      htmlFromMd(function(html){
        html = convertImgSrcToURI(html);
        html = getStyledHtml(html);
        makePdf(html, outPath);
      });
    }
    catch(err){
      console.log(err);
      return;
    }
  }

}

function htmlFromMd(callback){

  //explicitly setting default options below, in case we want to further configure the renderer
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });
  if(editorSelected()){
    var md = atom.workspace.getActivePaneItem().buffer.cachedText;
    var html = marked(md);
    console.log(html);
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
  var user_styles = atom.styles.getStyleElements();
  user_styles = user_styles[user_styles.length - 1].innerHTML;

  var mdpreview = atom.packages.activePackages["markdown-preview"];

  var styles = {
    previewStyles: mdpreview.stylesheets[0][1],
    syntaxStyles: atom.themes.getActiveThemes()[0].stylesheets[0][1],
    userStyles: user_styles
  };
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
  return atom.config.getSettings()['markdown-pdf'];
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
  var markdownPath = atom.workspaceView.getActivePaneItem().getPath();
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
