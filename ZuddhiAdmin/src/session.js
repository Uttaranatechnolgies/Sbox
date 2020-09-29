const Store = async (key, value) => {
  return new Promise(async (resolve) => {
    sessionStorage.setItem(key, value);
    return resolve(true);
  });
};

const Retrieve = async (key) => {
  return new Promise(async (resolve) => {
    return resolve(sessionStorage.getItem(key));
  });
};

const IsLoggedIn = (key) => {
  const data = sessionStorage.getItem(key);
  return !(data === null || data === undefined || data.length === 0);
};

const Remove = async (key) => {
  return new Promise(async (resolve) => {
    return resolve(sessionStorage.removeItem(key));
  });
};

export { Store, Retrieve, Remove, IsLoggedIn };
