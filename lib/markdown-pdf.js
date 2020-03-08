'use babel';

import { CompositeDisposable } from 'atom';
import config from './config';
import convert from './actions/convert';
import openSettings from './actions/open-settings';

export default {
  config,
  convert,
  openSettings,

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'markdown-pdf:convert': () => this.convert(),
        'markdown-pdf:open-settings': () => this.openSettings(),
      }),
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },
};
