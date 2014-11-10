##[markdown-pdf](https://atom.io/packages/markdown-pdf)

Convert markdown-formatted documents to pdf files without leaving Atom.

###Usage
Just focus the window containing your markdown file and use the `convert` command.

![markdown-preview](https://raw.githubusercontent.com/travs/markdown-pdf/master/assets/testpdf.png)

**Note:** Requires markdown-preview package to run. This is in the default Atom download, so you should be all set.

###How it works

The HTML provided by running the markdown through [marked](https://www.npmjs.org/package/marked) is prepended with the css from the [markdown-preview atom package](https://github.com/atom/markdown-preview). The syntax-highlights styling is pulled from the user's currently-active theme and added in the same way.

This HTML+CSS is then fed to [html-pdf](https://www.npmjs.org/package/html-pdf), which outputs the final pdf doc.

###Planned features/To-Do

- [x] Support .md *variant* filetypes (ex: .markdown, .mkd, etc.)
- [ ] Support hyperlinks in pdf output.
- [x] Support photos in pdf output.
- [ ] Allow custom syntax highlighting.
- [ ] Add dependency on markdown-preview in code.
- [x] Enable keybindings on different operating systems than OSX.

####Heart it? Hate it?
Feel free to run `apm star 'markdown-pdf'` or give some feedback ;-)
