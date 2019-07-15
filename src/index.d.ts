/**
 * Wraps the given Preact component as a Custom Element
 */
export function createCustomElement(component: any, propNames?: string[]) : HTMLElement;

/**
 * Registers the given Preact component in window.customElements, uder the given tag name
 */
export function registerCustomElement(component: any, tagName: string, propNames?: string[]) : void;

/**
 * @deprecated since version 3.1 use named exported function(s) instead
 */
export default declareCustomElement;
