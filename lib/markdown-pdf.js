module.exports = {
  activate: function() {
    atom.workspaceView.command(
      'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    var markdownpdf = require("markdown-pdf"), fs = require("fs");
    var editor = atom.workspace.getActiveTextEditor();

    var markdownPath = editor.getPath();
    if (markdownPath.indexOf(".md") == -1){
      alert('Please save the markdown file with a ".md" extension.');
      return;
    };
    var pdfPath = markdownPath.replace(".md", ".pdf");
    var html = getHtml(editor);
    console.log(html);

    function getHtml(editor){
      var mdpreview = atom.packages.activePackages["markdown-preview"];
      var styles = {
        previewStyles: mdpreview.stylesheets[0][1],
        syntaxStyles: atom.themes.getActiveThemes()[0]
      };
      mdpreview.mainModule.addPreviewForEditor(editor);
      var PreviousClipboardContents = atom.clipboard.read();  //save user's clipboard
      mdpreview.mainModule.copyHtml();
      var html = atom.clipboard.read();
      atom.clipboard.write(PreviousClipboardContents);        //give clipboard back to user
      var s;
      for s in styles{
        html = "<style>" + styles[s] + "</style>" + html;
      };
      return html;

    };

    function makePdf(cssStyles){
      fs.createReadStream(markdownPath)
        .pipe(markdownpdf())
        .pipe(fs.createWriteStream(pdfPath));
      console.log("Converted successfully");
    };
  }
};
