module.exports = {
  activate: function() {
    atom.workspaceView.command(
      'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    var fs = require("fs");
    var mdpreview = atom.packages.activePackages["markdown-preview"];
    var editor = atom.workspace.getActiveTextEditor();
    var markdownPath = atom.workspaceView.getActivePaneItem().getPath();
    if (!isMd(markdownPath)){
      alert("Please save the file as a markdown (.markdown, .md, .mkd, .mkdown or .ron)");
      return;
    }
    var pdfPath = markdownPath.replace(getExtension(markdownPath), "pdf");
    var html = getHtml();
    var styles = getStyles();
    html = styles + html;

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
      var ex = path.split(".").pop();
      return ex;
    }

    //may be able to combine isMd and getExtension into single function call.

    function getHtml(){
      if(!editorSelected()){
        var html = atom.workspace.getActivePaneItem()[0].outerHTML;  //return preview html if in focus
      }
      else{
        //var paneArray = atom.workspaceView.getPanes();
        var html = null;
        var ed = atom.workspace.getActivePaneItem();
        mdpreview.mainModule.addPreviewForEditor(ed);               //adds preview
        //below is not graceful, but it works for now. Releasing this as a bug-fix, but will patch over more cleanly
        atom.workspace.onDidAddPaneItem(function(){
          setTimeout(function(){
            atom.workspace.activateNextPane()                             //focus preview
            html = atom.workspace.getActivePaneItem()[0].outerHTML;       //return preview html
            makePdf(html, pdfPath);
          }, 1000)
        })

      }
    }

    function getStyles(){
      var styles = {
        previewStyles: mdpreview.stylesheets[0][1],
        syntaxStyles: atom.themes.getActiveThemes()[0].stylesheets[0][1]
      };
      var styleString = "";
      for(s in styles){
        styleString += "<style>" + styles[s] + "</style>";
      };
      return styleString;
    }

    function makePdf(hypermd, outputPath){
      var markdownpdf = require("markdown-pdf");
      markdownpdf().from.string(hypermd).to(outputPath, function () {
        console.log("Converted successfully. Output in " + outputPath);
      });
    };
  }
};
