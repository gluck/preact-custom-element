export interface Options {
    /**
     * Whether to render the component into a shadow root or not (default true)
     */
    shadow?: boolean;
}

/**
 * Wraps the given Preact component as a Custom Element
 */
export function createCustomElement(component: any, propNames?: string[], options?: Options) : HTMLElement;

/**
 * Registers the given Preact component in window.customElements, uder the given tag name
 */
export function registerCustomElement(component: any, tagName: string, propNames?: string[], options?: Options) : void;

/**
 * @deprecated since version 3.1 use named exported function(s) instead
 */
export default declareCustomElement;
