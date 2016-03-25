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

##### Special thanks to these folks

- [@schmurphy](https://github.com/NKMR6194): [#11](https://github.com/travs/markdown-pdf/pull/11)
- [@NKMR6194](https://github.com/NKMR6194): [#51](https://github.com/travs/markdown-pdf/pull/51), [#83](https://github.com/travs/markdown-pdf/pull/83)
- [@Nicnl](https://github.com/Nicnl): [#28](https://github.com/travs/markdown-pdf/pull/28)
- [@brianchung808](https://github.com/brianchung808): [#34](https://github.com/travs/markdown-pdf/pull/34)
- [@hdmi](https://github.com/hdmi): [#53](https://github.com/travs/markdown-pdf/pull/53)
- [@CumpsD](https://github.com/CumpsD): [#59](https://github.com/travs/markdown-pdf/pull/59)
- [@pydolan](https://github.com/pydolan): [#72](https://github.com/travs/markdown-pdf/pull/72), [#74](https://github.com/travs/markdown-pdf/pull/74)
- [@Galadirith](https://github.com/Galadirith): [#88](https://github.com/travs/markdown-pdf/pull/88)
