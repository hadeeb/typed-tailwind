export function Tw() {
  return new Tailwind();
}

class Tailwind {
  constructor() {
    this.value = "";
  }
  $() {
    return this.value;
  }
  [Symbol.toPrimitive]() {
    return this.$();
  }

  // Building methods
  add(value) {
    this.value && (this.value += " ");
    this.value += value;
    return this;
  }
  block() {
    return this.add("block");
  }
  relative() {
    return this.add("relative");
  }
}
