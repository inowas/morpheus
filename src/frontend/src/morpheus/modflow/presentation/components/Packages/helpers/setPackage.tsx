const setPackage = (setFunction: any, initPackage: any, key: string, value: any) => {
  setFunction({
    ...initPackage,
    values: {
      ...initPackage.values,
      [key]: value,
    },
  });
};

export default setPackage;
