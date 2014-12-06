##[markdown-pdf](https://atom.io/packages/markdown-pdf)

Convert markdown-formatted documents to pdf, png or jpeg files without ever leaving Atom.

###Usage
Just focus the window containing your markdown file and use the `convert` command.

![markdown-pdf](assets/testpdf.png)

You can set parameters in the package's settings, such as page size, orientation, and output format (pdf, png or jpeg).

###How it works

The HTML provided by running the markdown through [marked](https://www.npmjs.org/package/marked) is prepended with the css from the [markdown-preview atom package](https://github.com/atom/markdown-preview). The syntax-highlights styling is pulled from the user's currently-active theme and added in the same way.

This HTML+CSS is then fed to [html-pdf](https://www.npmjs.org/package/html-pdf), which outputs the final image (pdf, png or jpeg) doc.

####Heart it? Hate it?
Feel free to run `apm star 'markdown-pdf'` or give some feedback :smile:
