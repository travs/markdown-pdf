var fs = require("fs");
var pdf = require('html-pdf');
var path = require('path');
var url = require('url');
var less = require('less');
var mdpreview = null;


module.exports = {

  config: {
    "syntax": {
      "title": "Syntax theme",
      "type": "string",
      "default": ""
    },
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
    // var syntax = {
    //   "title": "Syntax theme",
    //   "type": "string",
    //   "default": "Active syntax theme",
    //   "enum": atom.themes.getLoadedThemesNames()
    // }
    atom.config.set("markdown-pdf.syntax" , atom.themes.getActiveThemeNames()[0]);
  },

  convert: function() {
    try{
      mdpreview = atom.packages.getActivePackage('markdown-preview');

      if(!mdpreview) {
        // Use markdown-preview-plus if markdown-preview has been disabled
        mdpreview = atom.packages.getActivePackage('markdown-preview-plus');
      }

      outPath = getOutputPath();
      converter.htmlFromPreview()
          .convertImgSrcToURI()
          .styleHtml((dataString) => {
            var html = uglyFix(dataString);
            makePdf(html, outPath);
          });
    }
    catch(err){
      atom.notifications.addError('markdown-pdf: ' + err, {dismissable: true});
      console.log(err.stack);
      return;
    }

    function uglyFix(dataString){
      var html = dataString;
      // Ugly Fix 1:
      base64hr = 'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OENDRjNBN0E2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OENDRjNBN0I2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Q0NGM0E3ODY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Q0NGM0E3OTY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqqezsUAAAAfSURBVHjaYmRABcYwBiM2QSA4y4hNEKYDQxAEAAIMAHNGAzhkPOlYAAAAAElFTkSuQmCC';
      hrURI = '"atom://' + mdpreview.name + '/assets/hr.png"';
      html = html.split(hrURI).join('"data:image/png;base64,' + base64hr + '"');
      // Ugly Fix 2:
      html = html.split(',\n:host {').join(' {');
      html = html.split(',\n:host').join(',');
      html = html.split(':host').join('');
      return html
    }

  }
}


var converter = {

  dataString: '',

  htmlFromPreview: function () {
    // we use the clipboard to grab HTML from a preview package (maybe there's a better way?)
    var cb = atom.clipboard;
    var old = cb.read();  //save old clipboard contents

    if(mdpreview.name === 'markdown-preview'){
      mdpreview.mainModule.copyHtml();  //get html on clipboard
    }
    else if (mdpreview.name === 'markdown-preview-plus') {
      mdpreview.mainModule.copyHtml(null, 200); // copy parsed markdown with maths scaled 200%
    }

    this.dataString = cb.read();
    cb.write(old);  //put old clipboard contents back

    return this;
  },

  convertImgSrcToURI: function () {
    // puts all "img src" in URI form (i.e. "file://")
    var div = document.createElement('div');
    div.innerHTML = this.dataString;
    var imgs = div.getElementsByTagName('img');
    for(var s = 0; s < imgs.length; s++){
      imgs[s].src = processSrc(imgs[s].attributes.src.value);
    }
    this.dataString = div.innerHTML;
    return this;
  },

  styleHtml: function (callback) {
    var wrappedHtml = '<body class="markdown-preview native-key-binding markdown-body">' + this.dataString + '</body>';
    mdless = fs.readFileSync(__dirname + '/github-markdown.less', 'utf-8');


    var styles = {};
    var syntaxName = atom.config.get("markdown-pdf.syntax");
    var syntaxNumber = atom.themes.getLoadedThemeNames().indexOf(syntaxName);
    var syntax = atom.themes.getLoadedThemes()[syntaxNumber];

    var theme = atom.themes.getActiveThemes()[1];

    //styles.syntaxStyles = syntax.stylesheets[0][1];

    var paths = [];
    paths.push(syntax.getStylesheetsPath());
    paths.push(syntax.path);
    paths.push(theme.getStylesheetsPath());
    paths.push(theme.path);

    less.render(mdless, {paths: paths}, (e, output) => {

      styles.gfmstyles = output;

      var syntaxLess = fs.readFileSync(syntax.path + '/index.less', 'utf-8');
      less.render(syntaxLess, {paths: paths}, (e, output) => {

        styles.syntaxStyle = output;

        var styleString = '';
        for(var s in styles){
          styleString += '<style>' + styles[s] + '</style>';
        }
        var dataString = styleString + wrappedHtml;

        // After rendering the less files, it will send dataString to the callback
        // function.
        callback(dataString);
      });
    });
  }
}


function makePdf(inputHtml, outputPath){
  atom.notifications.addInfo('Converting markdown to PDF...', {icon: 'markdown'})
  var conf = atom.config.get('markdown-pdf');
  pdf.create(inputHtml, conf).toFile(outputPath, function(err, res) {
    if (err) {
      throw 'Error converting to image format. Check console for more information.';
    }else{
      atom.notifications.addSuccess('Converted successfully.', {detail: 'Output in ' + outputPath, icon: 'file-pdf'});
    }
  });
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
  var markdownPath = atom.workspace.getActivePaneItem().getPath();
  if (!isMd(markdownPath)){    //file is saved as something other than markdown-type file
    atom.notifications.addWarning(
      'Warning: File not saved as markdown type.',
      {
        detail: 'Attempting conversion of .{} file. \nValid extensions are `.markdown, .md, .mkd, .mkdown` and  `.ron`'.replace('{}', markdownPath.split('.').pop()),
        dismissable: true
      }
    );
  }
  else if (!markdownPath){      //file is unsaved
    atom.notifications.addWarning('Warning: File not saved!.', {detail: 'Attempting conversion anyway.'});
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
    var out = markdownPath.replace(markdownPath.split(path.sep).slice(-1)[0], markdownPath.split(path.sep).slice(-1)[0].replace(getExtension(markdownPath), atom.config.get('markdown-pdf.type')));
    return out;
  }
}

function isMd(path){
  if(!path) return true;
  var accepted = ["markdown", "md", "mkd", "mkdown", "ron"];
  var current = path.split(".").pop();
  if(accepted.indexOf(current) != -1) return true;
  return false;
}

function getExtension(path){
  var ex = path.split('.').pop();
  return ex;
}
