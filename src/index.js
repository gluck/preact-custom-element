import { h, render } from 'preact';

const camelize = str =>
  str.replace(/-(\w)/, (_, c) => (c ? c.toUpperCase() : ''));

const Empty = () => null;

export function createCustomElement(Component, propNames) {
  function PreactCustomElement() {
    const self = Reflect.construct(HTMLElement, [], PreactCustomElement);
    const shadow = self.attachShadow({ mode: "open" });
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

  return PreactCustomElement;
}

export function registerCustomElement(Component, tagName, propNames) {
  return customElements.define(
    tagName || Component.displayName || Component.name,
    createCustomElement(Component, propNames),
  );
}

export default registerCustomElement;

function renderElement() {
  this._root = render(toVdom(this, this._vdomComponent), this.shadowRoot, this._root);
}

function unRenderElement() {
  render(h(Empty), this.shadowRoot, this._root);
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
