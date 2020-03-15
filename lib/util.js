'use babel';

import fs from 'fs';
import path from 'path';

const markdownExtensions = ['markdown', 'md', 'mkd', 'mkdown', 'ron'];

// return first editor if none selected
// return undefined if no editor opened
function getEditor() {
  return atom.workspace.getActiveTextEditor() ||
         atom.workspace.getTextEditors()[0];
}

function isMd(filepath) {
  if (!filepath) return true; // attempt to convert from buffer
  const extension = filepath.split('.').pop();
  return markdownExtensions.includes(extension);
}

function getPwd() {
  const treeDirPath = atom.packages.getActivePackage('tree-view').mainModule.treeView.selectedPath;
  if(!fs.lstatSync(treeDirPath).isDirectory()){
    return path.dirname(treeDirPath);
  }
  return treeDirPath;
}

function getOutputPath(inputPath) {
  let outputDir;
  let outputPath;
  const userConfigOutputDir = atom.config.get('markdown-pdf.outputDir');
  if (userConfigOutputDir) {
    outputDir = path.resolve(conf.outputDir);
  }
  if (!inputPath){  // converting an unsaved file
    atom.notifications.addWarning(
      'Warning: Input file not saved!.',
      { detail: 'Attempting conversion anyway.' }
    );
    if (!outputDir){ // attempt to get pwd from tree view
      outputDir = getPwd();
    }
    outputPath = path.join(outputDir, `${new Date().getTime()}.pdf`);
  } else {  // inputPath is a string
    if (!isMd(inputPath)) {  // inputPath a non-markdown type
      atom.notifications.addWarning(
        'Warning: File not saved as markdown type.',
        {
          detail: 'Attempting conversion of .{} file. \nValid extensions are `.markdown, .md, .mkd, .mkdown` and  `.ron`'.replace('{}', inputPath.split('.').pop())
        }
      );
    }
    const parsePath = path.parse(inputPath);
    if (!outputDir) {
      outputDir = parsePath.dir
    }
    outputPath = path.join(outputDir, `${parsePath.name}.pdf`);
  }
  return outputPath;
}

export default { getEditor, getOutputPath }
