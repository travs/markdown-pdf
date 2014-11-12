module.exports = {
  convert: function() {
    atom.workspaceView.command('markdown-pdf:convert', this.convert);
    var fs = require("fs");
    var mdpreview = atom.packages.activePackages["markdown-preview"];
    var editor = atom.workspace.getActiveTextEditor();
    var markdownPath = atom.workspaceView.getActivePaneItem().getPath();
    if (!isMd(markdownPath)){
      alert("Please save the file as a markdown (.markdown, .md, .mkd, .mkdown or .ron)");
      return;
    }
    var pdfPath = markdownPath.replace(getExtension(markdownPath), "pdf");

    htmlFromMd(function(html){
      html = getStyledHtml(html);
      makePdf(html, pdfPath);
    });


    function editorSelected(){
      if(atom.workspace.getActiveTextEditor() != undefined) return true;
      return false;
    }

    function isMd(path){
      //check extension of current file
      var accepted = ["markdown", "md", "mkd", "mkdown", "ron"];
      var current = path.split(".").pop();
      if(accepted.indexOf(current) != -1) return true;
      return false;
    }

    function getExtension(path){
      var ex = path.split('.').pop();
      return ex;
    }

    //Above: may be able to combine isMd and getExtension into single function call.

    function htmlFromMd(callback){
      var marked = require('marked');
      if(editorSelected()){
        fs.readFile(markdownPath, 'utf-8', function(err, data){
          var md = data;
          var html = marked(md);
          callback(html);
        });
      }
    }

    function getStyledHtml(input){
      return getStyles() + wrapHtml(input);
    }

    function wrapHtml(input){
      return '<body class="markdown-preview native-key-binding">' + input + '</body>';
    }

    function getStyles(){
      var styles = {
        previewStyles: mdpreview.stylesheets[0][1],
        syntaxStyles: atom.themes.getActiveThemes()[0].stylesheets[0][1]
      };
      var styleString = '';
      for(s in styles){
        styleString += '<style>' + styles[s] + '</style>';
      };
      return styleString;
    }

    function makePdf(inputHtml, outputPath){
      var pdf = require('html-pdf');
      pdf.create(inputHtml, { width: '210mm', height: '297mm', border: '10mm'}, function(err, buffer) {
        if (err) {
          alert("Error converting to pdf. Check console for more information.");
          console.log(err + "\nIf the error is a timeout, try running the command again.");
        }
        fs.writeFile(outputPath, buffer);
        console.log("Converted successfully. Output in " + outputPath);
      });
    }

  }
};
