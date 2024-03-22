export interface IPropertyValueObject {
  [name: string]: any;
}

const getParameterValues = (arr: any[]) => {
  const returnValue: IPropertyValueObject = {};
  arr.forEach((item) => {
    returnValue[item.id] = item.value;
  });

  return returnValue;
};

export {getParameterValues};
