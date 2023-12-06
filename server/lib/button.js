class Button {
  #isChecked = false;
  #onCheckCallback = null;

  set onCheck(callback) {
    this.#onCheckCallback = callback;
  }

  isChecked() {
    return this.#isChecked;
  }


  toggleCheck() {
    this.#isChecked = !this.#isChecked;

    // Emit the event when the state changes
    this.#onCheckCallback && this.#onCheckCallback(this.#isChecked);
  }

  static getInstance() {
    if (!Button.instance) {
      Button.instance = new Button();
    }
    return Button.instance;
  }
}

export default Button;
