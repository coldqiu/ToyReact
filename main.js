import { createElement, render, Component } from "./toy-react";

class MyComponent extends Component {
  render() {
    return (
      <div>
        <div>my component</div>
        {this.children}
      </div>
    );
  }
}

render(
  <MyComponent id="a" class="b">
    <div class="b-1">abc</div>
    <div class="b-2"></div>
    <div class="b-3"></div>
  </MyComponent>,
  document.body
);

// console.log("b", b);
