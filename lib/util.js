const path = require('path');
const fs = require('fs');
const conf = atom.config.get('markdown-pdf');

function isMd(somePath){
  if(!somePath) return true;
  var accepted = ["markdown", "md", "mkd", "mkdown", "ron"];
  var current = somePath.split(".").pop();
  if(accepted.indexOf(current) !== -1) return true;
  return false;
}

function getOutputPath(inputPath){
  let outputDir;
  let outputPath;
  if(conf.outputDir) {
    outputDir = path.resolve(conf.outputDir);
  }
  if (!inputPath){  //converting an unsaved file
    atom.notifications.addWarning('Warning: Input file not saved!.', {detail: 'Attempting conversion anyway.'});
    if(!outputDir){ // attempt to get pwd
      var treeDirPath = atom.packages.getActivePackage('tree-view').mainModule.treeView.selectedPath;
      if(!fs.lstatSync(treeDirPath).isDirectory()){
        outputDir = path.dirname(treeDirPath);
      }
    }
    outputPath = path.join(outputDir, `${new Date().getTime()}.pdf`);
  }
  else {  // inputPath is a string
    if (!isMd(inputPath)){  // inputPath a non-markdown type
      atom.notifications.addWarning(
        'Warning: File not saved as markdown type.',
        {
          detail: 'Attempting conversion of .{} file. \nValid extensions are `.markdown, .md, .mkd, .mkdown` and  `.ron`'.replace('{}', inputPath.split('.').pop()),
          dismissable: true
        }
      );
    }
    const parsePath = path.parse(inputPath);
    if(!outputDir) {
      outputDir = parsePath.dir
    }
    outputPath = path.join(outputDir, `${parsePath.name}.pdf`);
  }
  return outputPath;
}

module.exports = {
  getOutputPath
}
