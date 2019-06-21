import { h, render } from 'preact';

const camelize = str =>
  str.replace(/-(\w)/, (_, c) => (c ? c.toUpperCase() : ''));

const Empty = () => null;

export default function register(Component, tagName, propNames) {
  function PreactCustomElement() {
    const self = Reflect.construct(HTMLElement, [], PreactCustomElement);
    self._vdomComponent = Component;
    return self;
  }

  PreactCustomElement.prototype = Object.create(HTMLElement.prototype);
  Object.setPrototypeOf(PreactCustomElement, HTMLElement);

  Object.assign(PreactCustomElement.prototype, {
    constructor: PreactCustomElement,
    connectedCallback() {
      renderElement.apply(this);
    },
    attributeChangedCallback() {
      renderElement.apply(this);
    },
    detachedCallback() {
      unRenderElement.apply(this);
    },
  });

  Object.defineProperty(PreactCustomElement, 'observedAttributes', {
    get: () => propNames,
  });

  return customElements.define(
    tagName || Component.displayName || Component.name,
    PreactCustomElement,
  );
}

function renderElement() {
  this._root = render(toVdom(this, this._vdomComponent), this, this._root);
}

function unRenderElement() {
  render(h(Empty), this, this._root);
}

function toVdom(element, nodeName) {
  if (element.nodeType === 3) return element.nodeValue;
  if (element.nodeType !== 1) return null;

  const props = [...element.attributes].reduce((acc, attr) => {
    const propName = camelize(attr.name);
    acc[propName] = attr.value;
    return acc;
  }, {});

  const children = [...element.childNodes].map(toVdom);

  return h(nodeName || element.nodeName.toLowerCase(), props, children);
}
