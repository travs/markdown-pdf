let fs;
let fallback;
let mdpdf;
let mdpreview;
let util;

function loadDeps() {
  fs = require('fs');
  fallback = require('./fallback');
  mdpdf = require('mdpdf');
  util = require('./util');
}

module.exports = {
  config: {
    'format': {
      'title': 'Page Format',
      'type': 'string',
      'default': 'A4',
      'enum': ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid']
    },
    'border': {
      'title': 'Border Size',
      'type': 'string',
      'default': '20mm'
    },
    'style': {
      'title': 'Custom CSS Stylesheet (applied last)',
      'description': 'Provide the full path to the file',
      'type': 'string'
    }
  },

  activate: function() {
    loadDeps();
    atom.commands.add('atom-workspace', 'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    try{
      const conf = atom.config.get('markdown-pdf');
      let mdpreview = atom.packages.getActivePackage('markdown-preview');
      if(!mdpreview) { // use mpp if markdown-preview disabled
        mdpreview = atom.packages.getActivePackage('markdown-preview-plus');
      }
      const activeEditor = atom.workspace.getActiveTextEditor();
      const inPath = activeEditor.getFileName();
      const outPath = util.getOutputPath(inPath);
      const options = {
        source: inPath,
        destination: outPath,
        ghStyle: true,
        defaultStyle: true,
        pdf: {
          format: conf.format,
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
          }
        }
      };
      atom.notifications.addInfo('Converting to PDF...', {icon: 'markdown'});
      return mdpdf.convert(options)
      .then(() => {
        atom.notifications.addSuccess(
          'Converted successfully.',
          { detail: 'Output in ' + outPath, icon: 'file-pdf' }
        );
      })
      .catch(err => {
        throw err;
      })
    } catch(err) {
      try {
        atom.notifications.addWarning('Attempting conversion with fallback');
        fallback.convert();
      } catch(err) {
        const remote = require('remote');
        atom.notifications.addError(
          'Markdown-pdf: Error. Check console for more information.',
          {
            buttons: [{
              className: 'md-pdf-err',
              onDidClick: () => remote.getCurrentWindow().openDevTools(),
              text: 'Open console',
            }]
          }
        )
        console.log(err.stack);
        return;
      }
    }
  }
}
