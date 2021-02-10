/*
  Lazy load modules based on data-attributes
  specifying module file-names.
*/

const moduleElements = Array.from(document.querySelectorAll("[data-module]"));

if ("IntesectionObserver" in window) {
  const lazyModulesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const name = entry.target.getAttribute("data-module");
        if (entry.isIntersecting) {
          import(/* webpackChunkName: "[request]" */ `./${name}`).then(
            ({ default: name }) => {
              new name(entry.target);
            }
          );
          lazyModulesObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px 100px 0px",
    }
  );

  moduleElements.forEach((lazyModule) => {
    lazyModulesObserver.observe(lazyModule);
  });
} else {
  for (let i = 0; i < moduleElements.length; i++) {
    const el = moduleElements[i];
    const name = el.getAttribute("data-module");
    import(/* webpackChunkName: "[request]" */ `./${name}`).then(
      ({ default: name }) => {
        new name(el);
      }
    );
  }
}

/*
  Usage:
  ======
  html
  ----
  <button data-module="disappear">disappear!</button>
  js
  --
  // modules/disappear.js
  export default class Disappear {
    constructor(el) {
      el.style.display = none
    }
  }
*/
