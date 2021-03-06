var TokenList = function (node) {

  this
    .sift (node)
    .map(this.tokenize, this)
};

TokenList.prototype.tokenize = function (node) {
    var this$1 = this;


  var
    insert = function (node) { return function (symbol) { return (this$1 [symbol] = this$1 [symbol] || []).push (node); }; }

  void
    (node.text = node.textContent)
      .match (/[^{\}]+(?=})/g)
      .map (insert (node))
};

TokenList.prototype.sift = function (node) {

  var
    nodes = []
  , expression = /{(\w+|#)}/

  , visit = function (node) { return node.nodeType === Node.TEXT_NODE
        ? TEXT_NODE (node)
        : ELEMENT_NODE (node.attributes)
      && NodeFilter.FILTER_REJECT; } // We don't need 'em

  , TEXT_NODE = function (node) { return expression.test (node.textContent)
        && nodes.push (node); }

  , ELEMENT_NODE = function (attrs) { return []
        .slice.call (attrs)
        .map (function (attr) { return expression.test (attr.value) && nodes.push (attr); }); }

  , walker =
      document.createNodeIterator
        (node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, visit, null)

  while (walker.nextNode ()) { 0 } // Walk all nodes and do nothing.

  return nodes
};

TokenList.prototype.bind = function (context) {
    var this$1 = this;


  var
    reset = function (symbol) { return this$1 [symbol].map // more than one occurrence
        (function (node) { return node.textContent = node.text; })
      && [symbol, this$1 [symbol]]; }

 // must both run independently not in tandem

  , restore = function (ref) {
           var symbol = ref[0];
           var nodes = ref[1];

           return nodes.map ( function (node) { return node.textContent = (ref = node.textContent)
           .replace.apply ( ref, ['{'+symbol+'}', context [symbol]] )
             var ref;; });
    }

  Object
    .keys (this)
    .map(reset)
    .map(restore)
};

//function slice (text, tokens = []) {
//  const
//    match    = /({\w+})/g // stored regex is faster https://jsperf.com/regexp-indexof-perf
//  , replace  = token => (collect (token), '✂️')
//  , collect  = token => tokens.push (token)
//  , sections = text
//      .replace (match, replace)
//        .split ('✂️')

//  return zip (tokens, sections)
//        .map (element => element && new Text (element))
//}

// http://nshipster.com/method-swizzling/
// HTMLElement Swizzle - To swizzle a method is to change a class’s dispatch table in order to resolve messages from an existing selector to a different implementation, while aliasing the original method implementation to a new selector.

// 3.2.3 HTML element constructors
// https://html.spec.whatwg.org/multipage/dom.html#html-element-constructors
// Satisfy Element interface document.createElement
//   - https://dom.spec.whatwg.org/#concept-element-interface


//// base class to extend, same trick as before
//class HTMLCustomElement extends HTMLElement {

//  constructor(_)
//    { return (_ = super(_)).init(), _; }

//  init()
//    { /* override as you like */ }
//}

var HTMLElement = (
  function (constructor) {
    var E = function () {}
    E.prototype = constructor.prototype
    return E
  }
    //E.prototype.constructor = constructor // this only checks for typeof HTMLElement
) (window.HTMLElement)

// Preloading - https://w3c.github.io/preload
// Resource Hints - https://www.w3.org/TR/resource-hints
// https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/#push-vs-preload
// http://w3c.github.io/webcomponents/spec/imports/#h-interface-import
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12142852/
// Caching best practices - https://jakearchibald.com/2016/caching-best-practices/
//
//
// Link in body
//
// https://github.com/whatwg/html/commit/179983e9eb99efe417349a40ebb664bd11668ddd
// https://bugs.webkit.org/show_bug.cgi?id=172639
// https://github.com/whatwg/html/pull/616#issuecomment-180018260

void (function (Element) {
  var xhr = new XMLHttpRequest

  for (var i = 0, list = document.querySelectorAll ('link[id*="-"]'); i < list.length; i += 1) {

    var link = list[i];

    xhr.open ('GET', link.href)
    xhr.responseType = 'document'
    xhr.onload       = onload

    // this is kinda smelly!!!
    xhr.link         = link
    xhr.send ()
  }

  function onload () {
    var
      select =
        this
          .response
          .querySelectorAll
          .bind (this.response)

    , link = this.link

    , next = link.nextSibling

    , reflect = function (clone, node) { return function (attr) { return node [attr]
          && (clone [attr] = node [attr]); }; }

    for
      (var i = 0, list = document.querySelectorAll (link.id); i < list.length; i += 1)
        {
      var node = list[i];

      stamp.call
          (node, select ('template') [0].cloneNode (true))
    }


    for (var i$1 = 0, list$1 = select ('style,link,script'); i$1 < list$1.length; i$1 += 1) {
      var node$1 = list$1[i$1];

      var
        as = node$1.getAttribute ('as')

      , clone =
          document.createElement (node$1.localName)


      void ['src', 'href', 'textContent', 'rel']
        .map (reflect (clone, node$1))

      // use rel = 'preload stylesheet' for async
      // or use media=snuggsi => media || 'all' trick
      // loadCSS - https://github.com/filamentgroup/loadCSS
      // http://keithclark.co.uk/articles/loading-css-without-blocking-render
      'style' == as && (clone.rel = 'stylesheet')

      link.parentNode.insertBefore (clone, next)

      'script' == as &&
        (link.parentNode.insertBefore
          (document.createElement ('script'), next)
            .src = node$1.href)
    }
  }


  function stamp (template, insert, replacement) {
    var this$1 = this;


    for (var i = 0, list = this$1.querySelectorAll ('[slot]'); i < list.length; i += 1)
      {
      replacement = list[i];

      (slot =
        (template.content || template).querySelector
          ('slot[name='+ replacement.getAttribute ('slot') +']'))

        .parentNode
        .replaceChild (replacement, slot)
    }


    this.innerHTML = template.innerHTML
  }

}) (window.HTMLLinkElement)

// https://people.cs.pitt.edu/~kirk/cs1501/Pruhs/Spring2006/assignments/editdistance/Levenshtein%20Distance.htm

// https://github.com/WebReflection/hyperHTML/pull/100

// https://skillsmatter.com/skillscasts/10805-an-isomorphic-journey-to-a-lighter-and-blazing-fast-virtual-dom-alternative#video

// https://github.com/webcomponents/template
var Template = HTMLTemplateElement =

function (template) {

  template =
    typeof template == 'string'
      ? document.querySelector ('template[name='+template+']')
      : template

  template =
    this === HTMLTemplateElement
      ? template.cloneNode (true)
      : template

  template.name =
    template.getAttribute ('name')

  template.comment =
    document.createComment (template.name)

  template
    .parentNode
    .replaceChild
      (template.comment, template)

  return Object
    .defineProperty
      (template, 'bind', { value: bind })

  function bind (context) {
    var this$1 = this;


    var
      html     = ''
    , template = this.innerHTML
    , contexts = (ref = []).concat.apply ( ref, [context] )
        // https://dom.spec.whatwg.org/#converting-nodes-into-a-node

    var
      keys =
        'object' === typeof contexts [0]
          ? Object.keys (contexts [0])    // memoize keys
          :  []
          .concat (['#', 'self']) // add helper keys

    , tokens =
        keys.map (function (key) { return '{'+key+'}'; }) // memoize tokens

    , fragment = // create template polyfill here
        document.createElement ('template')

    , deposit = function (context, index) {
        var clone = template

        context = (typeof context  === 'object')
          ? context : { self: context }

        context ['#'] = index

        for (var i=0; i<tokens.length; i++)
          { clone = clone
            .split (tokens [i])
            .join  (context [keys [i]]) }

        return clone
      }

    void ( this.dependents || [] ).map
      (function (dependent) { return dependent.parentNode.removeChild (dependent); })

    for (var i=0, final = ''; i<contexts.length; i++)
      { html += deposit (contexts [i], i) }

    fragment.innerHTML = html

    var children =
      (fragment.content || fragment).childNodes

    this.dependents =
      Array.apply (null, children) // non-live

    this.comment.after
      && (ref$1 = this.comment).after.apply ( ref$1, this.dependents )

    !!!  this.comment.after
      && this.dependents.reverse ()
         .map (function (dependent) { return this$1.comment.parentNode.insertBefore
             (dependent, this$1.comment.nextSibling); })
    var ref;
    var ref$1;
  }
}

// The CustomElementRegistry Interface
// WHATWG - https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api
//
// HTML Element Constructors
//   - https://html.spec.whatwg.org/multipage/dom.html#html-element-constructors
//
// The Custom Elements Spec
// W3C - https://w3c.github.io/webcomponents/spec/custom/
// WHATWG- https://html.spec.whatwg.org/multipage/custom-elements.htm
//
// Legacy webcomponentsjs
//   - https://github.com/webcomponents/custom-elements/blob/master/src/CustomElementRegistry.js
//
//   - CEReactions
//     - https://github.com/webcomponents/custom-elements/pull/62
//     - https://html.spec.whatwg.org/multipage/custom-elements.html#cereactions
//     - https://html.spec.whatwg.org/#cereactions


!!! window.customElements
  && (window.customElements = {/* microfill */})


new (function () {
  function CustomElementRegistry (ref ) {
  if ( ref === void 0 ) ref = customElements;
  var define = ref.define;
  var get = ref.get;
  var whenDefined = ref.whenDefined;

    window.customElements
      .define = this
        ._define (undefined) // (define)
        .bind (this)
  }

  CustomElementRegistry.prototype._define = function ( delegate ) {
    var this$1 = this;
    if ( delegate === void 0 ) delegate = function (_){};


    // this.running = undefined

    //  definition = this.swizzle ( definition );

    return function ( name, constructor ) { return (delegate).apply
        ( window.customElements, this$1.register ( name, constructor ) ); }
  };


  CustomElementRegistry.prototype.register = function (name, constructor) {
    // perhaps this goes in swizzle
    (this [name] = constructor)
      .localName = name


    'loading' === document.readyState

      ? document.addEventListener
        ('DOMContentLoaded', (ref = this).queue.apply ( ref, arguments ))

      : (ref$1 = this).queue.apply ( ref$1, arguments )()

    return arguments
    var ref;
    var ref$1;
  };


  CustomElementRegistry.prototype.queue = function ( name, constructor ) {
    var this$1 = this;

    return function (event) { return [].slice.call (document.getElementsByTagName (name))
        // .reverse () // should be able to do depth first
        .map
          (this$1.upgrade (constructor)); }
  };


  // https://wiki.whatwg.org/wiki/Custom_Elements#Upgrading
  // "Dmitry's Brain Transplant"
  CustomElementRegistry.prototype.upgrade = function (constructor) {

    // Here's where we can swizzle

    return function (element) { return Object.setPrototypeOf
        (element, constructor.prototype)

      .connectedCallback
        && element.connectedCallback (); }
  };

  // http://nshipster.com/method-swizzling/
  CustomElementRegistry.prototype.swizzle = function ( name ) {
    var Class = [], len = arguments.length - 1;
    while ( len-- > 0 ) Class[ len ] = arguments[ len + 1 ];
 };

  return CustomElementRegistry;
}())
var ParentNode = function (Element) { return ((function (Element) {
    function anonymous () {
      Element.apply(this, arguments);
    }

    if ( Element ) anonymous.__proto__ = Element;
    anonymous.prototype = Object.create( Element && Element.prototype );
    anonymous.prototype.constructor = anonymous;

    anonymous.prototype.selectAll = function ( strings ) {
    var tokens = [], len = arguments.length - 1;
    while ( len-- > 0 ) tokens[ len ] = arguments[ len + 1 ];


    strings =
      (ref = []).concat.apply ( ref, [strings] )

    var
      zip =
        function (part, token) { return part + token + strings.shift (); }

    , selector =
        tokens.reduce (zip, strings.shift ())

    return []
      .slice
      .call (this.querySelectorAll (selector))
    var ref;
  };

  anonymous.prototype.select = function ()
    // watch out for clobbering `HTMLInputElement.select ()`
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
    {
    var selector = [], len = arguments.length;
    while ( len-- ) selector[ len ] = arguments[ len ];
 return (ref = this).selectAll.apply ( ref, selector ) [0]
    var ref; };

    return anonymous;
  }(Element))); }

//function comb
//  // ElementTraversal interface
//  // https://www.w3.org/TR/ElementTraversal/#interface-elementTraversal
//
//(parent) {
//  if (parent.hasChildNodes())
//    for (let node = parent.firstChild; node; node = node.nextSibling)
//      comb (node)
//}

var EventTarget = function (HTMLElement) { return ((function (HTMLElement) {
    function anonymous () {
      HTMLElement.apply(this, arguments);
    }

    if ( HTMLElement ) anonymous.__proto__ = HTMLElement;
    anonymous.prototype = Object.create( HTMLElement && HTMLElement.prototype );
    anonymous.prototype.constructor = anonymous;

    anonymous.prototype.on = function ( event, handler ) {

    this.addEventListener
      (event, this.renderable (handler))
  };

  anonymous.prototype.renderable = function ( handler ) {
    var this$1 = this;


    // BIG BUG IN IE!!!
    //
    // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
    //
    // https://github.com/webcomponents/webcomponents-platform/blob/master/webcomponents-platform.js#L16

    return function (event, render) {
        if ( render === void 0 ) render = true;

        return (event.prevent = function (_) { return !!! (render = false) && event.preventDefault (); })

      && handler.call (this$1, event) !== false // for `return false`

      && render && this$1.render ();
    } // check render availability
  };

    return anonymous;
  }(HTMLElement))); }

var GlobalEventHandlers = function (Element) { return ((function (Element) {
    function anonymous () {
      Element.apply(this, arguments);
    }

    if ( Element ) anonymous.__proto__ = Element;
    anonymous.prototype = Object.create( Element && Element.prototype );
    anonymous.prototype.constructor = anonymous;

    anonymous.prototype.onconnect = function (event, target) {

//  RESERVED FOR IMPORTS WTF IS GOING ON
//  event
//    && event.target
//    && (target = event.target)
//    && this.mirror
//      (target.import.querySelector ('template'))

    this.templates =
      this
        .selectAll ('template[name]')
        .map  (function (template) { return new Template (template); })

    this.tokens =
      new TokenList (this)

    Element.prototype.onconnect
      && Element.prototype.onconnect.call (this)

    return this
  };

  // Reflection - https://en.wikipedia.org/wiki/Reflection_(computer_programming)
  // Type Introspection - https://en.wikipedia.org/wiki/Type_introspection
  //
  // In computing, type introspection is the ability of a program
  // to examine the type or properties of an object at runtime.
  // Some programming languages possess this capability.
  //
  // Introspection should not be confused with reflection,
  // which goes a step further and is the ability for a program to manipulate the values,
  // meta-data, properties and/or functions of an object at runtime.

  anonymous.prototype.reflect = function (handler) {

    /^on/.test (handler) // `on*`
      && handler // is a W3C event
        in HTMLElement.prototype

      && // automagically delegate event
        this.on ( handler.substr (2), this [handler] )
  };

  anonymous.prototype.register = function (node) {
    var this$1 = this;


    var
      register = function (event, handler) { return /^on/.test (event)
        // https://www.quirksmode.org/js/events_tradmod.html
        // because under traditional registration the handler value is wrapped in scope `{ onfoo }`
        && ( handler = (/{\s*(\w+)\s*}/.exec (node [event]) || []) [1])
        && ( handler = this$1 [handler] )
        && ( node [event] = this$1.renderable (handler) ); }

    void []
      .slice
      .call (node.attributes)
      .map  (function (attr) { return attr.name; })
      .map  (register)
  };

    return anonymous;
  }(Element))); }
var Custom = function (Element) { return ( (function (superclass) {
    function anonymous () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) anonymous.__proto__ = superclass;
    anonymous.prototype = Object.create( superclass && superclass.prototype );
    anonymous.prototype.constructor = anonymous;

    anonymous.prototype.connectedCallback = function () {
    this.context = {}

    superclass.prototype.initialize
      && superclass.prototype.initialize.call (this)

    Object.getOwnPropertyNames
      (Element.prototype).map
        (this.reflect, this)

    this
      .onconnect ()
      .render    ()
  };


  anonymous.prototype.render = function () {
    var this$1 = this;


    this
      .tokens
      .bind (this)

    this
      .templates
      .map (function (template) { return template.bind (this$1 [template.name]); })

    void
      [this ].concat( this.selectAll ('*'))
        .map (this.register, this)

    superclass.prototype.onidle && superclass.prototype.onidle.call (this)
  };

    return anonymous;
  }(( ParentNode
  ( EventTarget
  ( GlobalEventHandlers
  ( Element ))))))); }

// http://2ality.com/2013/09/window.html
// http://tobyho.com/2013/03/13/window-prop-vs-global-var

var Element = (
  function (Element) {

    var E =
      function (tag, constructor) {

//      const constructor =// swizzle
//        typeof tag === 'string'
//    //    ? HTMLCustomElement
//    //    : HTMLElement

          //https://gist.github.com/allenwb/53927e46b31564168a1d
          // https://github.com/w3c/webcomponents/issues/587#issuecomment-271031208
          // https://github.com/w3c/webcomponents/issues/587#issuecomment-254017839

            return function (klass) { return (ref = window.customElements).define.apply
                ( ref, (ref$1 = []).concat.apply ( ref$1, [tag] ).concat( [Custom (klass)]
                  , [{ constructor: constructor }] ))
                var ref;
                var ref$1;; }
      }

    // Assign `window.Element.prototype` in case of feature checking on `Element`
    E.prototype = Element.prototype

    return E

}) (window.Element)


