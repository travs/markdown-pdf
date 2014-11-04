module.exports = {
  activate: function() {
    atom.workspaceView.command(
      'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    var fs = require("fs");
    var editor = atom.workspace.getActiveTextEditor();

    var markdownPath = editor.getPath();
    if (markdownPath.indexOf(".md") == -1){
      alert('Please save the markdown file with a ".md" extension.');
      return;
    };
    var pdfPath = markdownPath.replace(".md", ".pdf");
    var html = getHtml(editor);
    makePdf(html, pdfPath);

    function getHtml(editor){
      var mdpreview = atom.packages.activePackages["markdown-preview"];
      var styles = {
        previewStyles: mdpreview.stylesheets[0][1],
        syntaxStyles: atom.themes.getActiveThemes()[0].stylesheets[0][1]
      };
      mdpreview.mainModule.addPreviewForEditor(editor);
      var PreviousClipboardContents = atom.clipboard.read();  //save user's clipboard
      mdpreview.mainModule.copyHtml();
      var html = atom.clipboard.read();
      atom.clipboard.write(PreviousClipboardContents);        //give clipboard back to user
      var styleString = "";
      for(s in styles){
        styleString += "<style>" + styles[s] + "</style>";
      };
      html = styleString + html;
      return html;
    };

    function makePdf(hypermd, outputPath){
      var markdownpdf = require("markdown-pdf");
      markdownpdf().from.string(hypermd).to(outputPath, function () {
        console.log("Converted successfully in " + outputPath);
      });
    };
  }
};
