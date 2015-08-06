## [markdown-pdf](https://atom.io/packages/markdown-pdf)

Convert markdown-formatted documents to pdf, png or jpeg files without ever leaving Atom.

### Usage
Just focus the window containing your markdown file and use the `convert` command.

The output PDF will be styled according to your currently-active theme in Atom, as well as any user styles you have added. It will appear in the same directory as the Markdown you are converting, with the same name and a different extension.

![markdown-pdf](https://raw.githubusercontent.com/travs/markdown-pdf/master/assets/testpdf.png)

You can set parameters in the package's settings, such as page size, orientation, and output format (pdf, png or jpeg).

### How it works

The HTML provided by running the markdown through [marked](https://www.npmjs.org/package/marked) is prepended with the css from the [markdown-preview atom package](https://github.com/atom/markdown-preview). The syntax-highlights styling is pulled from the user's currently-active theme and added in the same way.

This HTML+CSS is then fed to [html-pdf](https://www.npmjs.org/package/html-pdf), which outputs the final image (pdf, png or jpeg) doc.

The package has dependencies on [tree-view](https://github.com/atom/tree-view) and [markdown-preview](https://github.com/atom/markdown-preview), but since these are included in the default atom installation, you probably won't have to worry about that.

#### Heart it? Hate it?
Feel free to run `apm star 'markdown-pdf'` or give some feedback :smile:
