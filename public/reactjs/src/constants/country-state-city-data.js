import { Country, State, City } from 'country-state-city';

export const Countries = Country.getAllCountries().map((country) => {
  const obj = country;
  obj.value = country.name;
  obj.label = country.name;
  return obj;
});

export const States = State.getStatesOfCountry("IN").map((state) => {
  const obj = state;
  obj.value = state.name;
  obj.label = state.name;
  return obj;
});

export const Cities = (state) =>
  City.getCitiesOfState('IN', state?.isoCode).map((city) => {
    const obj = city;
    obj.value = city.name;
    obj.label = city.name;
    return obj;
  });

const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
};

export const getStatesData = async (data) => {
  const states = await data?.map((record, index) => {
    return {
      id: index + 1,
      name: record?.stateName,
      country_id: "101",
      value: record?.stateName,
      label: record?.stateName,
    }
  });
  return getUniqueListBy(states, 'name');
};

export const getCitiesData = async (data, { name }) => {
  const filtercitiesByState = await data?.filter((record) => {
    return name === record.stateName
  });

  const cities = await filtercitiesByState?.map((record, index) => {
    return {
      id: index + 1,
      name: record?.districtName,
      country_id: "101",
      value: record?.districtName,
      label: record?.districtName,
    }
  });
  return getUniqueListBy(cities, 'name');
};

export const getPincodeData = async (data, { name }) => {
  const filtercitiesByState = await data?.filter((record) => {
    return name === record.districtName
  });

  const pincodes = await filtercitiesByState?.map((record, index) => {
    return {
      id: index + 1,
      name: record?.districtName,
      country_id: "101",
      value: record?.pincode,
      label: String(record?.pincode),
    }
  });
  return getUniqueListBy(pincodes, 'value');
};