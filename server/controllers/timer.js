import Timer from '../lib/timer.js';
import timerSingleton from '../lib/timerSingleton.js';

// main Timer -----------------------------------------------------
export const startMainTimer = (req, res) => {
  try {
    timerSingleton.getInstance("mainTimer").start();
    console.log("timer started");
    // res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeMainTimer = (req, res) => {
  try {
    timerSingleton.getInstance("mainTimer").pauseToggle();
    // res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopMainTimer = (req, res) => {
  try {
    timerSingleton.getInstance("mainTimer").stop();
    // res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

// timer C1 -----------------------------------------------------
export const startTimerC1 = (req, res) => {
  try {
    timerSingleton.getInstance("C1Timer").start();
    res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeTimerC1 = (req, res) => {
  try {
    timerSingleton.getInstance("C1Timer").pauseToggle();
    res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopTimerC1 = (req, res) => {
  try {
    timerSingleton.getInstance("C1Timer").stop();
    res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

// timer C2 -----------------------------------------------------
export const startTimerC2 = (req, res) => {
  try {
    timerSingleton.getInstance("C2Timer").start();
    res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeTimerC2 = (req, res) => {
  try {
    timerSingleton.getInstance("C2Timer").pauseToggle();
    res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopTimerC2 = (req, res) => {
  try {
    timerSingleton.getInstance("C2Timer").stop();
    res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

// timer C3 -----------------------------------------------------
export const startTimerC3 = (req, res) => {
  try {
    timerSingleton.getInstance("C3Timer").start();
    res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeTimerC3 = (req, res) => {
  try {
    timerSingleton.getInstance("C3Timer").pauseToggle();
    res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopTimerC3 = (req, res) => {
  try {
    timerSingleton.getInstance("C3Timer").stop();
    res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

// timer C4 -----------------------------------------------------
export const startTimerC4 = (req, res) => {
  try {
    timerSingleton.getInstance("C4Timer").start();
    res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeTimerC4 = (req, res) => {
  try {
    timerSingleton.getInstance("C4Timer").pauseToggle();
    res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopTimerC4 = (req, res) => {
  try {
    timerSingleton.getInstance("C4Timer").stop();
    res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

// timer C5 -----------------------------------------------------
export const startTimerC5 = (req, res) => {
  try {
    timerSingleton.getInstance("C5Timer").start();
    res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeTimerC5 = (req, res) => {
  try {
    timerSingleton.getInstance("C5Timer").pauseToggle();
    res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopTimerC5 = (req, res) => {
  try {
    timerSingleton.getInstance("C5Timer").stop();
    res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

export const GetTotalTime = (req, res) => {
  try {
    const mainTimer = timerSingleton.getInstance("mainTimer");
    const C1Timer = timerSingleton.getInstance("C1Timer");
    const C2Timer = timerSingleton.getInstance("C2Timer");
    const C3Timer = timerSingleton.getInstance("C3Timer");
    const C4Timer = timerSingleton.getInstance("C4Timer");
    const C5Timer = timerSingleton.getInstance("C5Timer");

    const totalTime = C1Timer.elapsedTime + C2Timer.elapsedTime + C3Timer.elapsedTime + C4Timer.elapsedTime + C5Timer.elapsedTime;

    res.status(200).send(totalTime.toString());
  } catch(e) {
    console.error(e)
  }
}