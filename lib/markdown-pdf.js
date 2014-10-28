module.exports = {
  activate: function() {
    atom.workspaceView.command(
      'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    var markdownpdf = require("markdown-pdf"), fs = require("fs");
    editor = atom.workspace.getActiveTextEditor();
    stylePath = atom.packages.activePackages["markdown-preview"].stylesheets[0][0]
    markdownPath = editor.getPath();
    pdfPath = markdownPath.replace(".md", ".pdf");
    console.log(stylePath);
    fs.createReadStream(markdownPath)
      .pipe(markdownpdf({cssPath: stylePath}))
      .pipe(fs.createWriteStream(pdfPath))
  }
};
