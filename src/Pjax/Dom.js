/**
 * Object that is going to deal with DOM parsing/manipulation
 *
 * @namespace Barba.Pjax.Dom
 * @type {Object}
 */
var Dom = {
  /**
   * The name of the data attribute on the container
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  dataNamespace: 'namespace',

  /**
   * Prefix of the HTML classes added
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  HTMLClassPrefix: 'page-',

  /**
   * Id of the main wrapper
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  wrapperId: 'barba-wrapper',
  wrapperDefaultId: 'barba-wrapper',
  wrapperAttr: 'data-barba-wrapper',

  /**
   * Data attributes used to identify the containers
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  containerAttr: 'data-barba-container',

  /**
   * Full HTML String of the current page.
   * By default is the innerHTML of the initial loaded page.
   *
   * Each time a new page is loaded, the value is the response of the xhr call.
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   */
  currentHTML: document.documentElement.innerHTML,

  /**
   * Parse the responseText obtained from the xhr call
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {String} responseText
   * @return {HTMLElement}
   */
  parseResponse: function(responseText) {
    this.currentHTML = responseText;

    var wrapper = document.createElement('div');
    wrapper.innerHTML = responseText;

    var titleEl = wrapper.querySelector('title');

    if (titleEl)
      document.title = titleEl.textContent;

    return this.getContainer(wrapper);
  },

  /**
   * Get the main barba wrapper by the ID `wrapperId`
   *
   * @memberOf Barba.Pjax.Dom
   * @return {HTMLElement} element
   */
  getWrapper: function() {
    var wrapper = document.querySelector('[' + this.wrapperAttr + '="' + this.wrapperId + '"]');

    if (!wrapper)
      throw new Error('Barba.js: wrapper not found!');

    return wrapper;
  },

  /**
   * Get the container on the current DOM,
   * or from an HTMLElement passed via argument
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {HTMLElement}
   */
  getContainer: function(element) {
    if (!element)
      element = document.body;

    if (!element)
      throw new Error('Barba.js: DOM not ready!');

    var container = this.parseContainer(element);

    if (container && container.jquery)
      container = container[0];

    if (!container)
      throw new Error('Barba.js: no container found');

    return container;
  },

  /**
   * Get the namespace of the container
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {String}
   */
  getNamespace: function(element) {
    if (!element) element = document.querySelector('[' + this.containerAttr + '="' + this.wrapperId + '"]');

    if (element && element.dataset) {
      console.warn("BarbaJS : getNamespace " + element.dataset[this.dataNamespace]); // eslint-disable-line no-console
      return element.dataset[this.dataNamespace];
    } else if (element) {
      console.warn("BarbaJS : getNamespace " + element.getAttribute('data-' + this.dataNamespace)); // eslint-disable-line no-console
      return element.getAttribute('data-' + this.dataNamespace);
    }

    return null;
  },

  /**
   * Put the container on the page
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   */
  putContainer: function(element) {
    element.style.visibility = 'hidden';

    var wrapper = this.getWrapper();
    wrapper.appendChild(element);
  },

  /**
   * Get container selector
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {HTMLElement} element
   */
  parseContainer: function(element) {
    return element.querySelector('[' + this.containerAttr + '="' + this.wrapperId + '"]');
  },

  /**
   * Set HTML element class
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {HTMLElement} element
   */
  setHTMLClass: function(namespace) {
    // Remove previous pages classes from the html
    var klasses = document.documentElement.className.split(" ").filter(function(klass) {
        var isPage = klass.lastIndexOf(this.HTMLClassPrefix, 0) === 0 ? true : false;

        return !isPage;
    });

    // The namespace can contain multiple slugs
    var namespaces = namespace.split(" ").map(function(n) {
        klasses.push(this.HTMLClassPrefix + n);
    });

    document.documentElement.className = klasses.join(" ").trim();
  }
};

module.exports = Dom;
