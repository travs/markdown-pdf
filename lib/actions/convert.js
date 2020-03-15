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
      const currentBuffer = activeEditor.getBuffer();
      const bufferContent = currentBuffer.getText();
      inPath = path.join(os.tmpdir(), `${Date.now()}.md`);
      fs.writeFileSync(inpath, bufferContent);
    }
    let headerFile;
    if (conf.header) {
      headerFile = path.join(os.tmpdir(), `${Date.now()}.header.html`);
      fs.writeFileSync(headerFile, conf.header);
    }
    let footerFile;
    if (conf.footer) {
      footerFile = path.join(os.tmpdir(), `${Date.now()}.footer.html`);
      fs.writeFileSync(footerFile, conf.footer);
      console.log(footerFile)
    }
    const outPath = util.getOutputPath(inPath);
    console.log(conf); // TODO: remove
    const options = {
      source: inPath,
      destination: outPath,
      ghStyle: conf.ghStyle,
      defaultStyle: conf.defaultStyle,
      noEmoji: !conf.emoji,
      header: headerFile,
      footer: footerFile,
      pdf: {
        format: conf.format,
        orientation: conf.orientation,
        quality: 100,
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
    let defaultStyleSheetPath = atom.styles.getUserStyleSheetPath();
    if (fs.existsSync(defaultStyleSheetPath)) {
      const pathObj = path.parse(defaultStyleSheetPath);
      if (pathObj.ext === '.less') {
        const lessData = fs.readFileSync(defaultStyleSheetPath, 'utf8');
        const convertedSheetPath = tmp.tmpNameSync({postfix: '.css'});
        const rendered = await less.render(lessData);
        fs.writeFileSync(convertedSheetPath, rendered.css, 'utf8');
        options.styles = convertedSheetPath;
      } else {
        options.styles = defaultStyleSheetPath;
      }
    }
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
