const path = require('path');

function isMd(somePath){
  if(!somePath) return true;
  var accepted = ["markdown", "md", "mkd", "mkdown", "ron"];
  var current = somePath.split(".").pop();
  if(accepted.indexOf(current) !== -1) return true;
  return false;
}

function getOutputPath(mdPath){
  if (!isMd(mdPath)){    //show warning
    atom.notifications.addWarning(
      'Warning: File not saved as markdown type.',
      {
        detail: 'Attempting conversion of .{} file. \nValid extensions are `.markdown, .md, .mkd, .mkdown` and  `.ron`'.replace('{}', mdPath.split('.').pop()),
        dismissable: true
      }
    );
  } else if (!mdPath){      //show warning and continue
    atom.notifications.addWarning('Warning: File not saved!.', {detail: 'Attempting conversion anyway.'});
    var treeDirPath = atom.packages.getActivePackage('tree-view').mainModule.treeView.selectedPath;
    if(!fs.lstatSync(treeDirPath).isDirectory()){
      treeDirPath = path.dirname(treeDirPath);
    }

    var d = new Date();
    var outName = d.getTime() + '.pdf';
    var outputPath = path.join(treeDirPath, outName);
    return outputPath;
  }
  var parsePath = path.parse(mdPath);
  var out = path.join(parsePath.dir, parsePath.name + '.pdf');
  return out;
}

module.exports = {
  getOutputPath
}
