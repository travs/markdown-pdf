const path = require('path');

function isMd(path){
  if(!path) return true;
  var accepted = ["markdown", "md", "mkd", "mkdown", "ron"];
  var current = path.split(".").pop();
  if(accepted.indexOf(current) != -1) return true;
  return false;
}

function getOutputPath(){
  var markdownPath = atom.workspace.getActivePaneItem().getPath();
  if (!isMd(markdownPath)){    //show warning
    atom.notifications.addWarning(
      'Warning: File not saved as markdown type.',
      {
        detail: 'Attempting conversion of .{} file. \nValid extensions are `.markdown, .md, .mkd, .mkdown` and  `.ron`'.replace('{}', markdownPath.split('.').pop()),
        dismissable: true
      }
    );
  }
  else if (!markdownPath){      //show warning and continue
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
  var parsePath = path.parse(markdownPath);
  var out = path.join(parsePath.dir, parsePath.name +
    '.' + atom.config.get('markdown-pdf.type'));
  return out;
}

module.exports = {
  getOutputPath
}
