import { createElement, render, Component } from "./toy-react";

class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2,
    };
  }
  render() {
    return (
      <div>
        <div>my component</div>
        <button
          onclick={() => {
            console.log("this onclick:", this);
            this.setState({ a: this.state.a + 1 });
          }}
        >
          add
        </button>
        <span>a: {this.state.a.toString()}</span>
        <span>b: {this.state.b.toString()}</span>
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
