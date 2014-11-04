module.exports = {
  activate: function() {
    atom.workspaceView.command(
      'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    var fs = require("fs");
    var mdpreview = atom.packages.activePackages["markdown-preview"];
    var editor = atom.workspace.getActiveTextEditor();
    var markdownPath = editor.getPath();
    if (markdownPath.indexOf(".md") == -1){
      alert('Please save the markdown file with a ".md" extension.');
      return;
    };
    var pdfPath = markdownPath.replace(".md", ".pdf");
    var html = getHtml(editor);
    var styles = getStyles();
    html = styles + html;
    makePdf(html, pdfPath);

    /*function checkForMd(markdownPath){

    }*/

    function getHtml(editor){
      mdpreview.mainModule.addPreviewForEditor(editor);
      var PreviousClipboardContents = atom.clipboard.read();  //save user's clipboard
      mdpreview.mainModule.copyHtml();
      var html = atom.clipboard.read();
      atom.clipboard.write(PreviousClipboardContents);        //give clipboard back to user
      return html;
    };

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
