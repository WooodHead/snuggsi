# Build Process

_📖  [Please see `bin/README.md`](../bin/README.md) For a list of `bin` scripts used within the build pipeline._


## `snuggsi.min.es.br`

*Mime Type* : `application/ecmascript` _([Specification](https://tools.ietf.org/html/rfc4329#section-8.2))_

*Weight* : ~ 1,300 OCTETS _(1.3kiloBytes)_


## `snuggsi.min.js.br`

*Mime Type* : `application/javascript` _([Specification](https://tools.ietf.org/html/rfc4329#section-7.2))_

*Weight* : ~ 1,400 OCTETS _(1.4kiloBytes)_


## Glossary
  - [Content Negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
  - [Javascript MIME types](https://html.spec.whatwg.org/#javascript-mime-type)
  - [Scripting Media Types _(rfc4329)_](https://www.rfc-editor.org/rfc/rfc4329.txt)
  - [WHATWG/W3c approval of media types](https://github.com/w3c/webcomponents/issues/645#issuecomment-317338144)
  - [why you should know `application/ecmascript`](https://stackoverflow.com/questions/9664282/difference-between-application-x-javascript-and-text-javascript-content-types)
  - [Difference between Ethernet frame and Packet](https://www.youtube.com/watch?v=wcSee63SIlg)
  - [MTU _(Maximum Transmission Unit)_](https://en.wikipedia.org/wiki/Maximum_transmission_unit)
  - [_(Ethernet)_ Frame](https://en.wikipedia.org/wiki/Ethernet_frame)
  - [OCTET](https://en.wikipedia.org/wiki/Octet_(computing))


## Pipeline

### ECMAScript Bundle (snuggsi.es)
Mime Type : `application/ecmascript` _([Specification](https://tools.ietf.org/html/rfc4329#section-8.2))_

#### snuggsi.es _(bundled)_
  - Uses [cat](https://en.wikipedia.org/wiki/Cat_(Unix)) command
for creating [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) bundle.

`elements/*.es` ➡️  `snuggsi.es`


### ECMAScript 5 Transpilation (snuggsi.js)
Mime Type : `application/javascript` _([Specification](https://tools.ietf.org/html/rfc4329#section-7.2))_

File Extension: `.js`

#### snuggsi.js
  - Uses [buble.js](http://buble.surge.sh)

`snuggsi.es` ➡️  `snuggsi.js`


### Minification _(snuggsi.min.es)_ &amp; _(snuggsi.min.js)_ 
Mime Type : `application/ecmascript` _([Specification](https://tools.ietf.org/html/rfc4329#section-8.2))_

Mime Type : `application/javascript` _([Specification](https://tools.ietf.org/html/rfc4329#section-7.2))_


#### `snuggsi.es` ➡️  `snuggsi.min.es`
_(Uses [Uses `uglify-es`](https://github.com/mishoo/UglifyJS2/tree/harmony))_

#### `snuggsi.js` ➡️  `snuggsi.min.js`
_(Uses [UglifyJS](https://github.com/mishoo/UglifyJS))_


### Compression

⚠️ Please read why Internet Explorer won't let `DEFLATE` be great.
[here](https://blogs.msdn.microsoft.com/ieinternals/2014/10/21/compressing-the-web/)
,[here](https://support.microsoft.com/en-us/help/837251/internet-explorer-does-not-correctly-decompress-data-that-uses-the-gzip)
, [here](https://stackoverflow.com/questions/883841/why-do-real-world-servers-prefer-gzip-over-deflate-encoding#answer-1579506)
,and [here](https://zoompf.com/blog/2012/02/lose-the-wait-http-compression)
⚠️

**snuggsi** handles the following content encoding tokens:
  - `brotli`
  - `gzip`
  - `deflate` _(zlib)_

  - [HTTP Compression](https://en.wikipedia.org/wiki/HTTP_compression)
  - [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
  - [Content-Encoding Tokens](https://en.wikipedia.org/wiki/HTTP_compression#Content-Encoding_tokens)
  - [Comparison of Brotli, Deflate, Zopfli, LZMA, LZHAM
  and Bzip2 Compression Algorithms](https://cran.r-project.org/web/packages/brotli/vignettes/brotli-2015-09-22.pdf)
  - [Great article on compression](https://blog.cloudflare.com/results-experimenting-brotli)
Links
  - DEFLATE format - https://en.wikipedia.org/wiki/DEFLATE
  - [rfc1951](https://tools.ietf.org/html/rfc1951)


#### Brotli Compression _(snuggsi.min.br)_

`snuggsi.min.es` ➡️  `snuggsi.min.es.br`

`snuggsi.min.js` ➡️  `snuggsi.min.js.br`

Links
- http://caniuse.com/#search=brotli
- https://en.wikipedia.org/wiki/Brotli
- https://certsimple.com/blog/nginx-brotli
- https://blogs.akamai.com/2016/02/understanding-brotlis-potential.html
- https://hacks.mozilla.org/2015/11/better-than-gzip-compression-with-brotli

Server Support
- Ruby _(brotli)_ - https://github.com/miyucy/brotli
- Node _(brotli)_ - https://www.npmjs.com/package/brotli
- Node _(iltrob)_ - https://github.com/MayhemYDG/iltorb
- Koa _(koa-send)_ - https://github.com/koajs/send
- Express _(shrink-ray)_ - https://github.com/aickin/shrink-ray
- NGINX _(ngx_brotli)_ - https://github.com/google/ngx_brotli
- Apache _(mod_brotli)_ - https://httpd.apache.org/docs/trunk/mod/mod_brotli.html
- IIS _(IIS Brotli)_ - https://www.iis.net/downloads/community/2016/03/iis-brotli

Browser Support
- http://caniuse.com/#search=brotli
- Google Chrome has supported Brotli since version 49
- Microsoft Edge supports Brotli since version 15
- Mozilla Firefox implemented Brotli in version 44
- Opera supports Brotli since version 36
- Safari supports Brotli as of version 10, released September 20, 2016


#### Zopfli Compression _(snuggsi.min.br)_

`snuggsi.min.es` ➡️  `snuggsi.min.es.zo`

`snuggsi.min.js` ➡️  `snuggsi.min.js.zo`

Links
- [Zopfli Optimization: Literally Free Bandwidth - Coding Horror](https://blog.codinghorror.com/zopfli-optimization-literally-free-bandwidth/)
  - ZLIB format - https://en.wikipedia.org/wiki/Zlib
  - [rfc1950](https://tools.ietf.org/html/rfc1950)


#### GZip Compression _[rfc1952](https://www.ietf.org/rfc/rfc1952.txt) (snuggsi.min.gz)_
`snuggsi.min.es` ➡️  `snuggsi.min.es.gz`

`snuggsi.min.js` ➡️  `snuggsi.min.js.gz`


a gzip file/stream contains:

  - a 10-byte header, containing a magic number, a version number and a time stamp
  - optional extra headers, such as the original file name,
  - a body, containing a **DEFLATE-compressed payload**
  - an 8-byte footer, containing a CRC-32 checksum and the length of the original uncompressed data

Links
  - GZIP format - https://en.wikipedia.org/wiki/Zlib
  - [rfc1952](https://tools.ietf.org/html/rfc1952)

Server Support
  - http://www.gzip.org

Browser Support
  - http://caniuse.com/#search=gzip
  - http://schroepl.net/projekte/mod_gzip/browser.htm
  - Netscape 6+ (Netscape 4-5 does, but with some bugs)
  - Internet Explorer 5.5+ (July 2000) and IE 4 if set to HTTP/1.1
  - Opera 5+ (June 2000)
  - Lynx 2.6+ (some time before 1999)
  - Firefox 0.9.5+ (October 2001)
  - Chrome since forever
  - Safari since forever (as far as I can tell)
