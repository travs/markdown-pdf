## [Markdown to PDF](https://atom.io/packages/markdown-pdf)

Convert markdown-formatted documents to pdf files without ever leaving Atom.

### Usage
Just focus the window containing your markdown file and use the `convert` command (`Packages > Markdown PDF > Convert`) or use the shortcut `ctrl+alt+e`.

The output PDF will be styled similar to the markdown on `github.com`, as well as any [user styles](https://flight-manual.atom.io/using-atom/sections/basic-customization/#style-tweaks) you have added.

It will appear in the same directory as the Markdown you are converting, with the same name and a `.pdf` extension.

You can set parameters in the package's settings, such as page and border size.

![markdown-pdf](https://raw.githubusercontent.com/travs/markdown-pdf/master/assets/testpdf.png)

### Tips

#### User styles

Note that user styles will have to be encapsulated in a `.markdown-body` selector to override the default stylesheets, like this:

```less
.markdown-body {
  h1 {
    font-size: 1.3em;
  }
}
```

#### Page breaks

Page breaks can be added with this element:

```html
<div style="page-break-after: always;"></div>
```

#### Image paths

If you have trouble rendering an image, you may have to use a relative path:

```
# this doesn't work:
![logo](/assets/logo.png)

# but this does
![logo](./assets/logo.png)
```

### Heart it? Hate it?

Feel free to run `apm star 'markdown-pdf'` or give some feedback :smile:

#### Special thanks to these folks

- [@BlueHatbRit](https://github.com/blueHatbRit)
- [@jooola](https://github.com/jooola)
- [@NKMR6194](https://github.com/NKMR6194)
- [@Nicnl](https://github.com/Nicnl)
- [@brianchung808](https://github.com/brianchung808)
- [@hdmi](https://github.com/hdmi)
- [@CumpsD](https://github.com/CumpsD)
- [@pydolan](https://github.com/pydolan)
- [@Galadirith](https://github.com/Galadirith)
