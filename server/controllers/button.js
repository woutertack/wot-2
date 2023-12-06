import buttonSingleton from "../lib/buttonSingleton.js";

/**
 * Start the internal timer
 * @param {*} req
 * @param {*} res
 */

export const ToggleButtonC1 = (req, res) => {
  try {
    buttonSingleton.getInstance('C1Button').toggleCheck();
    res.status(200).send( buttonSingleton.getInstance('C1Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}
export const checkStatusC1 = (req, res) => {
  try {
    buttonSingleton.getInstance('C1Button').isChecked();
    res.status(200).send( buttonSingleton.getInstance('C1Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}

export const ToggleButtonC2 = (req, res) => {
  try {
    buttonSingleton.getInstance('C2Button').toggleCheck();
    res.status(200).send( buttonSingleton.getInstance('C2Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}
export const checkStatusC2 = (req, res) => {
  try {
    buttonSingleton.getInstance('C2Button').isChecked();
    res.status(200).send( buttonSingleton.getInstance('C2Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}

export const ToggleButtonC3 = (req, res) => {
  try {
    buttonSingleton.getInstance('C3Button').toggleCheck();
    res.status(200).send( buttonSingleton.getInstance('C3Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}
export const checkStatusC3 = (req, res) => {
  try {
    buttonSingleton.getInstance('C3Button').isChecked();
    res.status(200).send( buttonSingleton.getInstance('C3Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}

export const ToggleButtonC4 = (req, res) => {
  try {
    buttonSingleton.getInstance('C4Button').toggleCheck();
    res.status(200).send( buttonSingleton.getInstance('C4Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}
export const checkStatusC4 = (req, res) => {
  try {
    buttonSingleton.getInstance('C4Button').isChecked();
    res.status(200).send( buttonSingleton.getInstance('C4Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}

export const ToggleButtonC5 = (req, res) => {
  try {
    buttonSingleton.getInstance('C5Button').toggleCheck();
    res.status(200).send( buttonSingleton.getInstance('C5Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}
export const checkStatusC5 = (req, res) => {
  try {
    buttonSingleton.getInstance('C5Button').isChecked();
    res.status(200).send( buttonSingleton.getInstance('C5Button').isChecked());
  } catch(e) {
    console.error(e)
  }
}
