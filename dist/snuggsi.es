const HTMLLinkElement = function

  // http://w3c.github.io/webcomponents/spec/imports/#h-interface-import

(tag) {

  const
    proxy = {}

  , link = document.querySelector // use CSS :any ?
      ('link#'+tag+'[rel=import], link[href*='+tag+'][rel=import]')

  , register = (event, handler) =>
      (HTMLImports && !!! HTMLImports.useNative)
        // https://github.com/webcomponents/html-imports#htmlimports
        ? HTMLImports.whenReady ( _ => handler ({ target: link }) ) // eww
        : link.addEventListener (event, handler)

    Object
      .defineProperties (proxy, {

        'addEventListener': {
          writable: false,

          value: function (event, handler) {
            !!! link
              ? handler ({ target: proxy })
              : register (event, handler)
          }
        }

      , 'onerror': // TODO: definition for onerror
          { set (handler) {} }
      })

  return proxy
}

class TokenList {

  constructor (node) {

    const
      textify = node =>
        (node.text = node.textContent) && node

    , tokenize = token =>
        // String.prototype.match returns ALL capture groups!!!
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
        token.textContent
          .match (/{(\w+|#)}/g)
            .map (symbolize)
            .map (insert (token))

    , symbolize = symbol =>
        symbol.match (/(\w+|#)/g) [0]

    , insert = token =>
        symbol =>
          (this [symbol] = this [symbol] || [])
            && this [symbol].push (token)

    this
      .sift (node)
      .map  (textify)
      .map  (tokenize)
  }

  sift (node) {

    const
      nodes = []

    , visit = node =>
        node.nodeType === Node.TEXT_NODE
          ? TEXT_NODE (node) && NodeFilter.FILTER_ACCEPT
          : ELEMENT_NODE (node.attributes) && NodeFilter.FILTER_REJECT

    , TEXT_NODE = node =>
        node.nodeType === Node.TEXT_NODE
          && /{(\w+|#)}/.test (node.textContent)

    , ELEMENT_NODE = attributes =>
        Array
          .from (attributes || [])
          .filter (attr => /{(\w+|#)}/g.test (attr.value))
          .map (attribute => nodes.push (attribute))

    , walker =
        document.createNodeIterator
          (node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, visit)
          // by default breaks on template YAY! 🎉

    while
      (node = walker.nextNode ())
        nodes.push (node)

    return nodes
  }

  bind (context, node) {

    const
      prepare = symbol =>
        this [symbol]
          .map (token => token.textContent = token.text)
        && symbol

    , replace = symbol =>
        this [symbol]
          .map (replacement (symbol))

    , replacement =
        symbol =>
          item =>
            item.textContent = item.textContent
              .replace ('{'+symbol+'}', context [symbol])

    Object
      .keys (this)
      .filter (key => context [key])
      .map  (prepare)
      .map  (replace)

    return this
  }

//zip (...elements) {

//  const
//    lock = (zipper, row) => [...zipper, ...row]

//  , pair = teeth => // http://english.stackexchange.com/questions/121601/pair-or-couple
//      (tooth, position) => // thunk
//        [tooth, teeth [position]]

//  return elements [1]
//    .map (pair (elements [0]))
//    .reduce (lock)
//}

//slice (text, tokens = []) {

//  const
//    match    = /({\w+})/g // stored regex is faster https://jsperf.com/regexp-indexof-perf
//  , replace  = token => (collect (token), '✂️')
//  , collect  = token => tokens.push (token)
//  , sections = text
//      .replace (match, replace)
//        .split ('✂️')

//  return zip (tokens, sections)
//     .filter (element => element)
//        .map (element => new Text (element))
//}
}

// INTERESTING! Converting `Template` to a class increases size by ~16 octets

const HTMLTemplateElement = Template = function (name) {

  return Object.assign
    (document.querySelector ('template[name='+name+']'), { bind } )

  function bind (context) {
    contexts = [].concat (...[context])
    console.log ('contexts', contexts)

    let
      dependent = undefined

    const
      fragments = []

    this.dependents =
      this.dependents || []

    while
      (dependent = this.dependents.pop ())
        dependent.remove ()

    let index = context.length

    contexts.map ((c, index) => {
      console.log (c, index)
    })

    while (index--) {

      let
        clone  = this.cloneNode (true)
      , tokens = (new TokenList (clone.content))

      contexts [index] =
        typeof contexts [index]  === 'object'
          ? contexts [index]
          : { self: contexts [index] }

      contexts [index]
        ['#'] = index

      tokens.bind (contexts [index])
      fragments.push (clone)
    }

    fragments.map
      (function (fragment) { this.dependents.push (...fragment.content.childNodes) }, this)

    let template = document.createElement ('template')

    let a = fragments
      .map (record => record.innerHTML)
      .join ('')

    template.innerHTML = a

    console.log (template.content.childNodes)

    this.after ( template.content )

    return this
  }

}

const EventTarget = Element => // why buble

  // DOM Levels
  // (https://developer.mozilla.org/fr/docs/DOM_Levels)
  //
  // WHATWG Living Standard HTML5 EventTarget
  // https://dom.spec.whatwg.org/#eventtarget
  //
  // MDN EventTarget
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
  //
  // DOM Level 3 EventTarget
  // https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget
  //
  // DOM Level 2 EventTarget
  // (AKA Str🎱  W3C #fockery) ➡️  https://annevankesteren.nl/2016/01/film-at-11
  // 😕  https://w3c.github.io/uievents/DOM3-Events.html#interface-EventTarget
  //❓❓ https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
  // https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget
  // Within https://w3c.github.io/uievents/#conf-interactive-ua
  // EventTarget links to WHATWG - https://dom.spec.whatwg.org/#eventtarget

(class extends Element {

  connectedCallback () {

    new HTMLLinkElement
      (this.tagName.toLowerCase ())
        .addEventListener
          ('load', this.onimport.bind (this))
  }

  listen (event, listener = this [event])

    // MDN EventTarget.addEventListener
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    //
    // WHATWG Living Standard EventTarget.addEventListener
    // https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
    //
    // DOM Level 2 EventTarget.addEventListener
    // https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-addEventListener

    { this.addEventListener (event, listener) }

//ignore (event, listener = 'on' + this [event])
//  // MDN EventTarget.removeEventListener
//  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
//  //
//  // WHATWG Living Standard EventTarget.removeEventListener
//  // https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
//  //
//  // DOM Level 2 EventTarget.removeEventListener
//  // https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-removeEventListener

//  { this.removeEventListener (event, listener) }

//dispatch (event)
//  // MDN EventTarget.dispatchEvent
//  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
//  //
//  // WHATWG Living Standard EventTarget.dispatchEvent
//  // https://dom.spec.whatwg.org/#dom-eventtarget-dispatchevent
//  //
//  // DOM Level 2 EventTarget.dispatchEvent
//  //  https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-dispatchEvent

//  { }
})

const ParentNode = Element =>

  // DOM Levels
  // (https://developer.mozilla.org/fr/docs/DOM_Levels)
  //
  // Living Standard HTML5 ParentNode
  // https://dom.spec.whatwg.org/#parentnode
  //
  // MDN ParentNode
  // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode
  //
  // ElementTraversal interface
  // https://www.w3.org/TR/ElementTraversal/#interface-elementTraversal

(class extends Element {

  // http://jsfiddle.net/zaqtg/10
  // https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
  // https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
  // NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT

  selectAll (selector)
    { return this.querySelectorAll (selector) }

  select (selector)
    // watch out for clobbering `HTMLInputElement.select ()`
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
    { return this.selectAll (selector) [0] }

  get tokens () {
    return this._tokens = // This is Janky
      this._tokens || new TokenList (this)
  }

})

//function comb
//  // ElementTraversal interface
//  // https://www.w3.org/TR/ElementTraversal/#interface-elementTraversal
//
//(parent) {
//  if (parent.hasChildNodes())
//    for (let node = parent.firstChild; node; node = node.nextSibling)
//      comb (node)
//}

const GlobalEventHandlers = Element =>

  // DOM Levels
  // (https://developer.mozilla.org/fr/docs/DOM_Levels)
  //
  // Living Standard HTML5 GlobalEventHandlers
  // https://html.spec.whatwg.org/multipage/webappapis.html#globaleventhandlers
  //
  // MDN GlobalEventHandlers
  // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
  //
  // MDN on* Events
  // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers
  //
  // DOM Level 0
  // This event handling model was introduced by Netscape Navigator,
  // and remains the most cross-browser model as of 2005
  // https://en.wikipedia.org/wiki/DOM_events#DOM_Level_0#DOM_Level_0
  //
  // Inline Model
  // https://en.wikipedia.org/wiki/DOM_events#DOM_Level_0#Inline_model
  //
  // Traditional Model
  // https://en.wikipedia.org/wiki/DOM_events#Traditional_model
  //
  // Traditional Registration
  // http://www.quirksmode.org/js/events_tradmod.html

(class extends Element {

  onimport (event) {

    const
      document =
        event.target.import

    , template = document &&
        document.querySelector ('template')

    template &&
      this.clone (template)

    // dispatch `import`
    // and captured from `EventTarget`
    this.constructor.onconnect &&
      this.constructor.onconnect.call (this)

    // dispatch `render`
    // and captured from `EventTarget`
    this.render ()
  }

  register (events = event => /^on/.exec (event)) {

    const
      mirror = handler =>
        (this [handler] === null) && // ensure W3C on event
          (this [handler] = Element [handler].bind (this))

    Object // mirror class events to element
      .getOwnPropertyNames (Element)
      .filter (events)
      .map (mirror)


    const
      nodes = // CSS :not negation https://developer.mozilla.org/en-US/docs/Web/CSS/:not
        // How can we select elements with on* attribute? (i.e. <... onclick=foo onblur=bar>)
        // If we can do this we can only retrieve the elements that have a traditional inline event.
        // This is theoretically more performant as most elements won't need traditional event registration.
        ':not(script):not(template):not(style):not(link)' // remove metadata elements

    , children =
        Array.from (this.querySelectorAll (nodes))

    , registered =
        node =>
          Array
            .from (node.attributes)
            .map (attr => attr.name)
            .filter (events)
            .length > 0

    , reflect =
        node =>
          Array
            .from (node.attributes)
            .map  (attr => attr.name)
            .filter (events)
            .map (reflection (node))

    , reflection =
        node => // closure
          event =>
            (node [event] = handle (node [event]))

    , handle =
        (handler, [_, event] = (/{\s*(\w+)\s*}/.exec (handler) || [])) =>
          event
            && Element [event]
            && Element [event].bind (this)
            || handler // existing handler
            || null  // default for W3C on* event handlers

    void [this]
      .concat (children)
      .filter (registered)
      .map    (reflect)
  }
})

const Component = Element => // why buble

  // exotic object - https://github.com/whatwg/html/issues/1704

( class extends // interfaces
  ( EventTarget ( ParentNode ( GlobalEventHandlers ( Element ))))
{

  constructor () { super ()

    this.context = {}

    // dispatch `initialize`
    // and captured from `EventTarget`
    this.initialize
      && this.initialize ()
  }

  render () {

    this
      .tokens.bind (this)

    Array
      .from // templates with `name` attribute
        (this.selectAll ('template[name]'))

      .map (template => !!! console.log (template) && template)

      .map
        (template => template.getAttribute ('name'))

      .map
        (name => (new Template (name)).bind (this [name]))

    this.register ()

    // dispatch `idle`
    // and captured from `EventTarget`
    Element.onidle &&
      Element.onidle.call (this) // TODO: Migrate to `EventTarget`
  }

  // This doesn't go here. Perhaps SlotList / Template / TokenList (in that order)
  clone (template) {

    const
      fragment =
        template
          .content
          .cloneNode (true)

    , slots =
        Array.from (fragment.querySelectorAll ('slot'))

    , replacements =
        Array.from (this.querySelectorAll ('[slot]'))

     , register = attribute =>
         (this.setAttribute (attribute.name, attribute.value))

    , replace = replacement =>
        slots
          .filter (match (replacement))
          .map (exchange (replacement))

    , match = replacement => slot =>
        replacement.getAttribute ('slot')
          === slot.getAttribute  ('name')

    , exchange = replacement =>
        slot => slot
          // prefer to use replaceWith however support is sparse
          // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
          // using `Node.parentNode` & `Node.replaceChid` as is defined in (ancient) W3C DOM Level 1,2,3
          .parentNode
          .replaceChild (replacement, slot)

    Array // map attributes from template
      .from (template.attributes)
      .map  (register)

    replacements
      .map (replace)

    this.innerHTML = ''
    this.append (fragment)
  }

})

const ElementPrototype = window.Element.prototype // see bottom of this file

const Element = function
  (tag, CustomElementRegistry = window.customElements )

  //https://gist.github.com/allenwb/53927e46b31564168a1d
  // https://github.com/w3c/webcomponents/issues/587#issuecomment-271031208
  // https://github.com/w3c/webcomponents/issues/587#issuecomment-254017839

{
  return function (Element) { // https://en.wikipedia.org/wiki/Higher-order_function

    CustomElementRegistry.define
      ( ...tag, Component (Element))
  }
}

// Assign `window.Element.prototype` in case of feature checking on `Element`
Element.prototype = ElementPrototype
  // http://2ality.com/2013/09/window.html
  // http://tobyho.com/2013/03/13/window-prop-vs-global-var
  // https://github.com/webcomponents/webcomponentsjs/blob/master/webcomponents-es5-loader.js#L19

