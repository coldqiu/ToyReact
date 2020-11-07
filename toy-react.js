const RENDER_TO_DOM = Symbol("render to dom");

export class ElementWrapper {
  // 封装一下 抹平差异F
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    // 正则匹配on开头的属性，监听这个事件
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(
        RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase()),
        value
      );
    } else {
      this.root.setAttribute(name, value);
    }
  }
  appendChild(component) {
    let range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    component[RENDER_TO_DOM](range);
  }
  [RENDER_TO_DOM](range) {
    // DOM　API 之 Range API https://developer.mozilla.org/zh-CN/docs/Web/API/Range
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null); // 非常空的对象，同对象一样原型指向null
    this.children = [];
    this._root = null;
    this._range = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(component) {
    // let range = document.createRange();
    // range.setStart(this.root, this.root.childNodes.length);
    // range.setEnd(this.root, this.root.childNodes.length);
    // component[RENDER_TO_DOM](range);
    this.children.push(component);
  }
  [RENDER_TO_DOM](range) {
    this._range = range; // 缓存下来
    // range.deleteContents();
    // range.insertNode(this.root);
    this.render()[RENDER_TO_DOM](range); // 一个递归调用
  }
  rerender() {
    this._range.deleteContents();
    this[RENDER_TO_DOM](this._range);
  }
  setState(newState) {
    if (this.state === null || typeof this.state !== "object") {
      this.state = newState;
      this.rerender();
      return;
    }

    let merge = function (oldState, newState) {
      for (let p in newState) {
        if (oldState[p] === null || typeof oldState[p] !== "object") {
          oldState[p] = newState[p];
        } else {
          merge(oldState[p], newState[p]);
        }
      }
    };
    merge(this.state, newState);
    this.rerender();
  }
}

export function createElement(type, attributes, ...children) {
  let e;
  if (typeof type === "string") {
    e = new ElementWrapper(type);
  } else {
    e = new type();
  }
  for (let p in attributes) {
    e.setAttribute(p, attributes[p]);
  }

  let insertChildren = (children) => {
    // 递归处理children
    for (let child of children) {
      if (typeof child === "string") {
        child = new TextWrapper(child);
      }
      if (typeof child === "object" && child instanceof Array) {
        insertChildren(child);
      } else {
        e.appendChild(child);
      }
    }
  };
  insertChildren(children);

  return e;
}

export function render(component, parentElement) {
  // parentElement.appendChild(component.root);
  let range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}
