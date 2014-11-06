##[markdown-pdf](https://atom.io/packages/markdown-pdf)

Convert markdown-formatted documents to pdf files without leaving Atom.

###Usage
Just focus the window containing your markdown file and use the `convert` command.

![markdown-preview](https://raw.githubusercontent.com/travs/markdown-pdf/master/assets/testpdf.png)

**Note:** Requires markdown-preview package to run. This is in the default Atom download, so you should be all set.

###How it works

The HTML provided by [markdown-preview](https://github.com/atom/markdown-preview) is prepended with the css from that same package. The syntax-highlights styling is pulled from the user's currently-active theme and added in the same way.

This HTML+CSS is then fed to [alanshaw's markdown-pdf node package](https://github.com/alanshaw/markdown-pdf) exploiting the ability for markdown documents to contain in-line HTML, and resulting in an accurate rendering of the final pdf.

###Planned features/To-Do

- [x] Support .md *variant* filetypes (ex: .markdown, .mkd, etc.)
- [ ] Support hyperlinks in pdf output.
- [ ] Support photos in pdf output.
- [ ] Allow custom syntax highlighting.
- [ ] Add dependency on markdown-preview in code.
- [ ] Enable keybindings on different operating systems than OSX.
