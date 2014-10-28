{WorkspaceView} = require 'atom'
MarkdownPdf = require '../lib/markdown-pdf'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "MarkdownPdf", ->
  activationPromise = null

  beforeEach ->
    atom.workspaceView = new WorkspaceView
    activationPromise = atom.packages.activatePackage('markdown-pdf')

  describe "when the markdown-pdf:toggle event is triggered", ->
    it "attaches and then detaches the view", ->
      expect(atom.workspaceView.find('.markdown-pdf')).not.toExist()

      # This is an activation event, triggering it will cause the package to be
      # activated.
      atom.workspaceView.trigger 'markdown-pdf:toggle'

      waitsForPromise ->
        activationPromise

      runs ->
        expect(atom.workspaceView.find('.markdown-pdf')).toExist()
        atom.workspaceView.trigger 'markdown-pdf:toggle'
        expect(atom.workspaceView.find('.markdown-pdf')).not.toExist()
