let timerInstance = null;

class Timer {
  #onTick = null;

  constructor() {
    this.elapsedTime = 0;
    this.timerId = null;
    this.pauzed = false;
  }

  set onTick(onTick) {
    this.#onTick = onTick;
  }

  start() {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.elapsedTime += 1;
      if (this.#onTick) this.#onTick(this.elapsedTime);
    }, 1000);
  }

  pauseToggle() {
    if (!this.pauzed) {
      clearInterval(this.timerId);
      this.pauzed = true;
      this.timerId = setInterval(() => {
        // this.elapsedTime += 1;
        if (this.#onTick) this.#onTick(this.elapsedTime);
      }
      , 1000);
    } else {
      this.pauzed = false;
      this.start();
    }
  }

  stop() {
    clearInterval(this.timerId);
    this.elapsedTime = 0;
    if (this.#onTick) this.#onTick(0);
  }

  static getInstance() {
    if (timerInstance === null) {
      timerInstance = new Timer();
    }

    return timerInstance;
  }
}

export default Timer;
