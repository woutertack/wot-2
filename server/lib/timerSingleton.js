import Timer from './timer.js';

const timerSingleton = (() => {
  let instances = {};
  
  const createInstance = () => {
    const timer = new Timer();
    return timer;
  };

  return {
    getInstance: (key) => {
      if (!instances[key]) {
        instances[key] = new Timer();
      }
      return instances[key];
    },
  };
})();

export default timerSingleton;
