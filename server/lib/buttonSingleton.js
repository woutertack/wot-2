import Button from "./button.js";

const buttonSingleton = (() => {
  let instances = {};

  // const createInstance = () => {
  //   const button = new Button();
  //   return button;
  // };

  return {
    getInstance: (key) => {
      if (!instances[key]) {
        instances[key] = new Button();
      }
      return instances[key];
    },
  };
})();

export default buttonSingleton;
