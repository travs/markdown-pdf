MarkdownPdf = require '../lib/markdown-pdf'
temp = require('temp').track()
path = require 'path'
fs = require 'fs'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "MarkdownPdf", ->
  [workspaceElement, tempDIRPath, activationPromise] = []

  beforeEach ->
    tempDIRPath     = temp.mkdirSync 'atom-temp-dir-'
    tempFixturePath = path.join tempDIRPath, 'simple.md'

    fixturePath = path.join __dirname, 'fixtures/simple.md'
    fixtureFile = fs.readFileSync fixturePath, 'utf8'

    fs.writeFileSync tempFixturePath, fixtureFile

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    activationPromise = atom.packages.activatePackage('markdown-pdf')

    waitsForPromise ->
      atom.themes.activateThemes()

    waitsForPromise ->
      atom.workspace.open(tempFixturePath)

  afterEach ->
    atom.themes.deactivateThemes()

  describe "when markdown-preview is enabled", ->
    it "makes a pdf from clipboard data after calling markdown-preview::copyHtml()", ->
      spyOn(atom.clipboard, 'write').andCallThrough()

      waitsForPromise ->
        atom.packages.activatePackage('markdown-preview')

      runs ->
        atom.commands.dispatch workspaceElement, 'markdown-pdf:convert'

      waitsForPromise ->
        activationPromise

      waitsFor "PDF to have been created", ->
        fs.readdirSync(tempDIRPath).length is 2

      runs ->
        expect(atom.clipboard.write).toHaveBeenCalled()

  describe "when markdown-preview-plus is enabled and markdown-preview disabled", ->
    it "makes a pdf from callback parameter data after calling markdown-preview-plus::copyHtml()", ->
      mpp = null

      waitsForPromise ->
        atom.packages.activatePackage('markdown-preview-plus')

      runs ->
        mpp = atom.packages.getActivePackage('markdown-preview-plus')
        spyOn(mpp.mainModule, "copyHtml").andCallThrough()
        atom.commands.dispatch workspaceElement, 'markdown-pdf:convert'

      waitsForPromise ->
        activationPromise

      waitsFor "PDF to have been created", ->
        fs.readdirSync(tempDIRPath).length is 2

      runs ->
        expect(mpp.mainModule.copyHtml).toHaveBeenCalled()
