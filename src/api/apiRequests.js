export const fetchInitialCount = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(3); 
    }, 100);
  });
};