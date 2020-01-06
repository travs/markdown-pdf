/** @babel */
let fs;
let fallback;
let less;
let mdpdf;
let os;
let path;
let tmp;
let util;

function loadDeps() {
  fs = require('fs');
  fallback = require('./fallback');
  less = require('less');
  mdpdf = require('mdpdf');
  os = require('os');
  path = require('path');
  tmp = require('tmp');
  util = require('./util');
}

module.exports = {
  config: {
    'ghStyle': {
      'title': 'Use Github markdown CSS',
      'type': 'boolean',
      'default': true,
      'order': 1
    },
    'defaultStyle': {
      'title': 'Use additional default styles',
      'description': 'Provides basic things like border and font size',
      'type': 'boolean',
      'default': true,
      'order': 2
    },
    'emoji': {
      'title': 'Enable Emojis',
      'description': 'Convert :tagname: style tags to Emojis',
      'type': 'boolean',
      'default': true,
      'order': 3
    },
    'format': {
      'title': 'Page Format',
      'type': 'string',
      'default': 'A4',
      'enum': ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'],
      'order': 4
    },
    'border': {
      'title': 'Border Size',
      'type': 'string',
      'default': '20mm',
      'order': 5
    },
    'footer': {
      'title': 'Page Footer',
      'description': 'Define pages footer in PDF document',
      'type': 'object',
      'order': 6,
      'properties': {
        'enable': {
          'title': 'Add footer',
          'description': 'Add page footer to the PDF document',
          'type': 'boolean',
          'default': false,
          'order': 1
        },
        'height': {
          'title': 'Footer height',
          'description': 'Height of the footer in milimiters',
          'type': 'integer',
          'default': 25,
          'minimum': 1,
          'maximum': 1000,
          'order': 2
        },
        'content': {
          'title': 'Footer content',
          'description': 'Content of the footer in HTML format. Use `{{page}}` placeholder to put page number',
          'type': 'string',
          'default': '<div style="text-align: center; font-size: 9pt;"> {{page}} </div>',
          'order': 3
        },
        'firstPage': {
          'title': 'Add footer on the first page',
          'type': 'boolean',
          'default': true,
          'order': 4
        }
      }
    },
    'header': {
      'title': 'Page Header',
      'description': 'Define pages header in PDF document',
      'type': 'object',
      'order': 7,
      'properties': {
        'enable': {
          'title': 'Add header',
          'description': 'Add page footer to the PDF document',
          'type': 'boolean',
          'default': false,
          'order': 1
        },
        'height': {
          'title': 'Header height',
          'description': 'Height of the header in milimiters',
          'type': 'integer',
          'default': 25,
          'minimum': 1,
          'maximum': 1000,
          'order': 2
        },
        'content': {
          'title': 'Header content',
          'description': 'Content of the header in HTML format. Use `{{page}}` placeholder to put page number',
          'type': 'string',
          'default': '<div style="text-align: right; font-size: 7pt;"> Generated with Atom Markdown PDF plugin </div>',
          'order': 3
        },
        'firstPage': {
          'title': 'Add header on the first page',
          'type': 'boolean',
          'default': true,
          'order': 4
        }
      }
    },
    'outputDir': {
      'title': 'Override output directory',
      'description': 'Defaults to input file directory',
      'type': 'string',
      'default': '',
      'order': 8
    },
    'forceFallback': {
      'title': 'Force Fallback Mode',
      'description': 'Legacy code; not all config options supported',
      'type': 'boolean',
      'default': false,
      'order': 9
    }
  },

  activate: function() {
    loadDeps();
    atom.commands.add('atom-workspace', 'markdown-pdf:convert', this.convert);
  },

  convert: async function() {
    try{
      const conf = atom.config.get('markdown-pdf');
      if(conf.forceFallback) {
        throw new Error('Forcing fallback mode');
      }
      const activeEditor = atom.workspace.getActiveTextEditor();
      let inPath = activeEditor.getPath();
      if(inPath === undefined) {  // make temp input file for unsaved md
        inPath = path.join(os.tmpdir(), `${new Date().getTime()}.md`);
        const currentBuffer = atom.workspace.getActiveTextEditor().getBuffer();
        const bufferContent = currentBuffer.getText();
        fs.writeFileSync(inPath, bufferContent);
      }
      const outPath = util.getOutputPath(inPath);
      const debugPath = path.join(os.tmpdir(), 'debug.html');
      const options = {
        debug: debugPath,
        source: inPath,
        destination: outPath,
        ghStyle: conf.ghStyle,
        defaultStyle: conf.defaultStyle,
        noEmoji: !conf.emoji,
        pdf: {
          format: conf.format,
          quality: 100,
          header: util.generateSectionConfig(conf.header),
          footer: util.generateSectionConfig(conf.footer),
          border: {
            top: conf.border,
            left: conf.border,
            bottom: conf.border,
            right: conf.border
          },
        }
      };
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
        { detail: 'Output in ' + outPath, icon: 'file-pdf' }
      );
    } catch(err) {
      try {
        console.error(err.stack);
        atom.notifications.addWarning('Attempting conversion with fallback.');
        await fallback.convert();
      } catch(err) {
        const remote = require('remote');
        if(err.message === 'MPP-ERROR') {
          atom.notifications.addError(
            'Markdown-preview-plus is not supported.',
            {detail: 'Please enable markdown-preview to use fallback mode.'}
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
}
