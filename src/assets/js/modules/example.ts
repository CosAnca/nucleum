export default class Example {
  el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    console.log(el.textContent, "- From the example module");
  }
}
