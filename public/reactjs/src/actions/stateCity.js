export const stateCityWatcher = (data, resolve, reject) => {
    return {
        type: "STAE_CITY_WATCHER",
        payload: data,
        resolve,
        reject,
    };
};
