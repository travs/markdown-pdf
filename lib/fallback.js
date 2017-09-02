const util = require('./util');

function convert() {
  try{
    mdpreview = atom.packages.getActivePackage('markdown-preview');
    if(!mdpreview) {
      mdpreview = atom.packages.getActivePackage('markdown-preview-plus');
    }
    const activeEditor = atom.workspace.getActiveTextEditor();
    const inPath = activeEditor.getPath();
    const outPath = util.getOutputPath(inPath);
    html = converter.htmlFromPreview()
      .convertImgSrcToURI()
      .styleHtml()
      .uglyFix();
    makePdf(html, outPath);
  } catch(err) {
    throw err;
  }
}

var converter = {
  dataString: '',
  htmlFromPreview: function () {
    var cb = atom.clipboard;
    var old = cb.read();  //save old clipboard contents
    if(mdpreview.name === 'markdown-preview') {
      mdpreview.mainModule.copyHtml();  //get html on clipboard
    } else if (mdpreview.name === 'markdown-preview-plus') {
      callback = atom.clipboard.write.bind(atom.clipboard);
      mdpreview.mainModule.copyHtml(callback, 200); // copy parsed markdown with maths scaled 200%
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

  styleHtml: function () {
    var wrappedHtml = '<body class="markdown-preview native-key-binding markdown-body">' + this.dataString + '</body>';
    var styles = {};
    const fs = require('fs');
    const less = require('less');
    styles.gfmstyles = fs.readFileSync(__dirname + '/github-markdown.css', 'utf-8');
    styles.syntaxStyles = atom.themes.getActiveThemes()[0].stylesheets[0][1];

    if(fs.existsSync(atom.styles.getUserStyleSheetPath(), 'utf8')){
      //add user stylesheet to html if it exists
      var upath = atom.styles.getUserStyleSheetPath();
      var ustyle = fs.readFileSync(upath, 'utf8');
      // compiling less to css if file extension is .less
      if (upath.substr(upath.length - 5).toLowerCase() == '.less') {
        less.render(ustyle, function(e, output) {
          styles.userStyles = output;
        });
      } else {
        styles.userStyles = ustyle;
      }
    }

    var styleString = '';
    for(var s in styles){
      styleString += '<style>' + styles[s] + '</style>';
    }
    this.dataString = styleString + wrappedHtml;
    return this;
  },

  uglyFix: function () {
    html = this.dataString;
    // Ugly Fix 1:
    base64hr = 'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OENDRjNBN0E2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OENDRjNBN0I2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Q0NGM0E3ODY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Q0NGM0E3OTY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqqezsUAAAAfSURBVHjaYmRABcYwBiM2QSA4y4hNEKYDQxAEAAIMAHNGAzhkPOlYAAAAAElFTkSuQmCC';
    hrURI = '"atom://' + mdpreview.name + '/assets/hr.png"'
    html = html.split(hrURI).join('"data:image/png;base64,' + base64hr + '"');
    // Ugly Fix 2:
    html = html.split(',\n:host {').join(' {');
    html = html.split(',\n:host').join(',');
    html = html.split(':host').join('');
    this.datastring = html;
    return this.dataString;
  }
}

function makePdf(inputHtml, outputPath){
  const pdf = require('html-pdf');
  var conf = atom.config.get('markdown-pdf');
  pdf.create(inputHtml, conf).toFile(outputPath, function(err, res) {
    if (err) {
      throw 'Error converting to image format. Check console for more information.';
    } else {
      atom.notifications.addSuccess('Converted successfully.', {detail: 'Output in ' + outputPath, icon: 'file-pdf'});
    }
  });
}

function processSrc(src){
  //make a local img src path into a "file:///absolute/path/" if it isn't already
  const path = require('path');
  const url = require('url');
  var protocol = url.parse(src).protocol;
  if(protocol == 'http:' || protocol == 'https:' || protocol == 'file:'){
    //if the src already starts with "file://", "https://", etc., it's already in the right form (URI)
    return src;
  } else if(path.resolve(src) !== src) {
    //if path is not absolute and has no protocol, it should be relative, so make it a URI
    //NOTE: previewer already took care of relative paths
    src = path.resolve(path.dirname(outPath), src);
    return 'file:///' + src;
  } else {
    //otherwise, the src is an absolute path. In this case we can just prepend "file://" to it
    return 'file:///' + src;
  }
}

module.exports = {
  convert
}
