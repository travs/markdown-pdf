'use babel';

export default {
  ghStyle: {
    title: 'Use Github markdown CSS',
    type: 'boolean',
    default: true,
    order: 1
  },
  defaultStyle: {
    title: 'Use additional default styles',
    description: 'Provides basic things like border and font size',
    type: 'boolean',
    default: true,
    order: 2
  },
  emoji: {
    title: 'Enable Emojis',
    description: 'Convert :tagname: style tags to Emojis',
    type: 'boolean',
    default: true,
    order: 3
  },
  format: {
    title: 'Page Format',
    type: 'string',
    default: 'A4',
    enum: ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'],
    order: 4
  },
  orientation: {
    title: 'Page Orientation',
    type: 'string',
    default: 'portrait',
    enum: ['portrait', 'landscape'],
    order: 5
  },
  border: {
    title: 'Border Size',
    type: 'string',
    default: '20mm',
    order: 6
  },
  header: {
    title: 'Header content',
    description: 'in HTML format. Use `{{page}}` for page number',
    type: 'string',
    default: '',
    order: 7,
  },
  footer: {
    title: 'Footer content',
    description: 'in HTML format. Use `{{page}}` for page number',
    type: 'string',
    default: '',
    order: 8,
  },
  outputDir: {
    title: 'Override output directory',
    description: 'Defaults to input file directory',
    type: 'string',
    default: '',
    order: 9
  },
  forceFallback: {
    title: 'Force Fallback Mode',
    description: 'Legacy code (not all config options supported)',
    type: 'boolean',
    default: false,
    order: 10
  },
  debugMode: {
    title: 'Enable debug mode',
    description: 'Write intermediate HTML file to output directory',
    type: 'boolean',
    default: false,
    order: 11
  }
};
