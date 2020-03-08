'use babel';

import fallback from '../fallback';
import fs from 'fs';
import less from 'less';
import mdpdf from 'mdpdf';
import os from 'os';
import path from 'path';
import tmp from 'tmp';
import util from '../util';

export default async function() {
  try {
    const conf = atom.config.get('markdown-pdf');
    if (conf.forceFallback) {
      throw new Error('Forcing fallback mode');
    }
    const activeEditor = atom.workspace.getActiveTextEditor();
    let inPath = activeEditor.getPath();
    if (inPath === undefined) {  // make temp input file for unsaved md
      inPath = path.join(os.tmpdir(), `${new Date().getTime()}.md`);
      const currentBuffer = atom.workspace.getActiveTextEditor().getBuffer();
      const bufferContent = currentBuffer.getText();
      fs.writeFileSync(inPath, bufferContent);
    }
    const outPath = util.getOutputPath(inPath);
    const options = {
      source: inPath,
      destination: outPath,
      ghStyle: conf.ghStyle,
      defaultStyle: conf.defaultStyle,
      noEmoji: !conf.emoji,
      pdf: {
        format: conf.format,
        orientation: conf.orientation,
        quality: 100,
        header: {
          height: null
        },
        footer: {
          height: null
        },
        border: {
          top: conf.border,
          left: conf.border,
          bottom: conf.border,
          right: conf.border
        },
      }
    };
    if (conf.debugMode) {
      options.debug = path.join(path.dirname(outPath), 'debug.html');
    }
    let sheetPath = atom.styles.getUserStyleSheetPath();
    const pathObj = path.parse(sheetPath);
    if(pathObj.ext === '.less') {
      const lessData = fs.readFileSync(sheetPath, 'utf8');
      sheetPath = tmp.tmpNameSync({postfix: '.css'});
      const rendered = await less.render(lessData);
      fs.writeFileSync(sheetPath, rendered.css, 'utf8');
    }
    options.styles = sheetPath;
    atom.notifications.addInfo('Converting to PDF...', {icon: 'markdown'});
    await mdpdf.convert(options);
    atom.notifications.addSuccess(
      'Converted successfully.',
      {
        detail: 'Output in ' + outPath,
        dismissable: true,
        icon: 'file-pdf'
      }
    );
  } catch(err) {
    try {
      console.error(err.stack);
      atom.notifications.addWarning('Attempting conversion with fallback.');
      await fallback.convert();
    } catch(err) {
      const remote = require('remote');
      if (err.message === 'MPP-ERROR') {
        atom.notifications.addError(
          'Markdown-preview-plus is not supported.',
          {
            detail: 'Please enable markdown-preview to use fallback mode.',
            dismissable: true
          }
        );
      } else {
        atom.notifications.addError(
          'Markdown-pdf: Error. Check console for more information.',
          {
            buttons: [{
              className: 'md-pdf-err',
              onDidClick: () => remote.getCurrentWindow().openDevTools(),
              text: 'Open console',
            }]
          }
        );
      }
      console.error(err.stack);
      return;
    }
  }
}
