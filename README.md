## [Markdown to PDF](https://atom.io/packages/markdown-pdf)

Convert markdown-formatted documents to pdf files without ever leaving Atom.

### Usage
Just focus the window containing your markdown file and use the `convert` command (`Packages > Markdown PDF > Convert`).

The output PDF will be styled similar to the markdown on `github.com`, as well as any [user styles](https://flight-manual.atom.io/using-atom/sections/basic-customization/#style-tweaks) you have added.

It will appear in the same directory as the Markdown you are converting, with the same name and a `.pdf` extension.

You can set parameters in the package's settings, such as page and border size.

![markdown-pdf](https://raw.githubusercontent.com/travs/markdown-pdf/master/assets/testpdf.png)

#### Note on styles

Note that user styles will have to be encapsulated in a `.markdown-body` selector to override the default stylesheets, like this:

```less
.markdown-body {
  h1 {
    font-size: 1.3em;
  }
}
```


#### Heart it? Hate it?
Feel free to run `apm star 'markdown-pdf'` or give some feedback :smile:

##### Special thanks to these folks

- [@BlueHatbRit](https://github.com/blueHatbRit): for helping integrate the essential [`mdpdf`](https://github.com/bluehatbrit/mdpdf) converter module
- [@schmurphy](https://github.com/NKMR6194): [#11](https://github.com/travs/markdown-pdf/pull/11)
- [@NKMR6194](https://github.com/NKMR6194): [#51](https://github.com/travs/markdown-pdf/pull/51), [#83](https://github.com/travs/markdown-pdf/pull/83)
- [@Nicnl](https://github.com/Nicnl): [#28](https://github.com/travs/markdown-pdf/pull/28)
- [@brianchung808](https://github.com/brianchung808): [#34](https://github.com/travs/markdown-pdf/pull/34)
- [@hdmi](https://github.com/hdmi): [#53](https://github.com/travs/markdown-pdf/pull/53)
- [@CumpsD](https://github.com/CumpsD): [#59](https://github.com/travs/markdown-pdf/pull/59)
- [@pydolan](https://github.com/pydolan): [#72](https://github.com/travs/markdown-pdf/pull/72), [#74](https://github.com/travs/markdown-pdf/pull/74)
- [@Galadirith](https://github.com/Galadirith): [#88](https://github.com/travs/markdown-pdf/pull/88)

