/**
 * @method getUniqueProps
 * @description This method returns an object containing the unique properties of the collection
 * @param {Object} collectionData
 * @returns {Object}
 */
export function getUniqueProps(collectionData: any) {
  let uniqueProps: any = {};

  const collectionDataItems = Object.keys(collectionData);

  for (let collectionKey of collectionDataItems) {
    if (!uniqueProps[collectionKey] && collectionData[collectionKey].unique) {
      uniqueProps[collectionKey] = {
        ...collectionData[collectionKey],
        bsonType: (collectionData[collectionKey].type =
          collectionData[collectionKey].type),
      };
    }
  }

  return uniqueProps;
}

/**
 * @method getCollectionProps
 * @description This method returns an object containing the acceptable properties for a mongodb collection
 * @param {Object} collectionData
 * @returns {Object}
 */
export function getCollectionProps(collectionData: any) {
  let collectionProps: any = {};

  const collectionDataItems = Object.keys(collectionData);

  for (let collectionKey of collectionDataItems) {
    if (!collectionProps[collectionKey]) {
      collectionProps[collectionKey] = {
        ...collectionData[collectionKey],
        bsonType: (collectionData[collectionKey].type =
          collectionData[collectionKey].type),
      };

      delete collectionProps[collectionKey].required;
      delete collectionProps[collectionKey].type;
      delete collectionProps[collectionKey].unique;
    }
  }

  return collectionProps;
}

export function getRequiredFields(collectionData: any) {
  let requiredFields: string[] = [];
  for (let key in collectionData) {
    if (collectionData[key].required) {
      requiredFields.push(key);
    }
  }

  return requiredFields;
}
