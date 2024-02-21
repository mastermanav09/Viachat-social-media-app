export function debounce(fn, delay) {
  let timer;

  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

export function throttle(fn, delay) {
  let flag = true;

  return function (...args) {
    const context = this;
    if (flag) {
      fn.apply(context, args);
      flag = false;

      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
}
