import { h, cloneElement, render, hydrate } from 'preact';

export function createCustomElement(Component, propNames, options) {
	function PreactElement() {
		const inst = Reflect.construct(HTMLElement, [], PreactElement);
		inst._vdomComponent = Component;
		inst._root =
			options && !options.shadow ? inst : inst.attachShadow({ mode: 'open' });
		return inst;
	}
	PreactElement.prototype = Object.create(HTMLElement.prototype);
	PreactElement.prototype.constructor = PreactElement;
	PreactElement.prototype.connectedCallback = connectedCallback;
	PreactElement.prototype.attributeChangedCallback = attributeChangedCallback;
	PreactElement.prototype.detachedCallback = detachedCallback;
	PreactElement.observedAttributes =
		propNames ||
		Component.observedAttributes ||
		Object.keys(Component.propTypes || {});

	return PreactElement;
}

export function registerCustomElement(Component, tagName, propNames, options) {
	return customElements.define(
		tagName || Component.tagName || Component.displayName || Component.name,
		createCustomElement(Component, propNames, options)
	);
}

export default registerCustomElement;

function connectedCallback() {
	this._vdom = toVdom(this, this._vdomComponent);
	(this.hasAttribute('hydrate') ? hydrate : render)(this._vdom, this._root);
}

function attributeChangedCallback(name, oldValue, newValue) {
	if (!this._vdom) return;
	const props = {};
	props[name] = newValue;
	this._vdom = cloneElement(this._vdom, props);
	render(this._vdom, this._root);
}

function detachedCallback() {
	render((this._vdom = null), this._root);
}

function toVdom(element, nodeName) {
	if (element.nodeType === 3) return element.data;
	if (element.nodeType !== 1) return null;
	let children = [],
		props = {},
		i = 0,
		a = element.attributes,
		cn = element.childNodes;
	for (i = a.length; i--; ) props[a[i].name] = a[i].value;
	for (i = cn.length; i--; ) children[i] = toVdom(cn[i]);
	return h(nodeName || element.nodeName.toLowerCase(), props, children);
}
