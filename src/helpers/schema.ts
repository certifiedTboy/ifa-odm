export class SchemaHelper {
  /**
   * @method getUniqueProps
   * @description This method returns an object containing the unique properties of the collection
   * @param {Object} collectionData
   * @returns {Object}
   */
  static getUniqueProps(collectionData: any): object {
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
  static getCollectionProps(collectionData: any): object {
    let collectionProps: any = {};

    const collectionDataItems = Object.keys(collectionData);

    for (let collectionKey of collectionDataItems) {
      if (Array.isArray(collectionData[collectionKey])) {
        if (collectionData[collectionKey][0].type) {
          collectionProps[collectionKey] = {
            bsonType: "array",
            maxItems: collectionData[collectionKey][0]?.maxItems,
            minItems: collectionData[collectionKey][0]?.minItems,
            items: {
              bsonType: collectionData[collectionKey][0].type,
            },
          };
        } else {
          collectionProps[collectionKey] = {
            bsonType: "array",
            maxItems: collectionData[collectionKey][0]?.maxItems,
            minItems: collectionData[collectionKey][0]?.minItems,
            items: {
              bsonType: "object",
              properties: {},
            },
          };

          for (let item of collectionData[collectionKey]) {
            for (let key in item) {
              if (
                !collectionProps[collectionKey].items.properties[key] &&
                key !== "maxItems" &&
                key !== "minItems"
              ) {
                collectionProps[collectionKey].items.properties[key] = {
                  ...item[key],
                  bsonType: (item[key].type = item[key].type),
                };

                delete collectionProps[collectionKey].items.properties[key]
                  .type;
                delete collectionProps[collectionKey].items.properties[key]
                  .required;
                delete collectionProps[collectionKey].items.properties[key]
                  .unique;
              }
            }
          }
        }
      } else {
        if (!collectionProps[collectionKey]) {
          if (!collectionData[collectionKey].type) {
            collectionProps[collectionKey] = {
              bsonType: "object",
              properties: {},
            };

            for (let item of Object.keys(collectionData[collectionKey])) {
              if (Array.isArray(collectionData[collectionKey][item])) {
                for (let key of collectionData[collectionKey][item]) {
                  collectionProps[collectionKey].properties[item] = {
                    bsonType: "array",
                    items: {
                      bsonType: key.type,
                    },
                  };
                }
              } else {
                collectionProps[collectionKey].properties[item] = {
                  ...collectionData[collectionKey][item],
                  bsonType: (collectionData[collectionKey][item].type =
                    collectionData[collectionKey][item].type),
                };
                delete collectionProps[collectionKey].properties[item].type;
                delete collectionProps[collectionKey].properties[item].required;
                delete collectionProps[collectionKey].properties[item].unique;
              }
            }
          } else {
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
      }
    }

    return collectionProps;
  }

  /**
   * @method getRequiredFields
   * @description This method returns an array containing the required fields of the collection
   * @param {Object} collectionData
   * @returns {Array}
   */
  static getRequiredFields(collectionData: any): Array<string> {
    let requiredFields: string[] = [];
    for (let key in collectionData) {
      if (collectionData[key].required) {
        requiredFields.push(key);
      }
    }

    return requiredFields;
  }

  /**
   * @method updateDocTimestamps
   * @description This method updates the createdAt and updatedAt timestamps of a document
   * @param {Object} doc - The document to be updated
   * @returns {Object} - The updated document with new timestamps
   */
  static updateDocTimestamps(doc: {}) {
    const newDoc = { ...doc, createdAt: new Date(), updatedAt: new Date() };
    return newDoc;
  }

  /**
   * @updateArrayDocTimestamps
   * @description This method updates the createdAt and updatedAt timestamps of an array of documents
   * @param {Array} arrayDoc - The array of documents to be updated
   * @returns {Array} - The updated array of documents with new timestamps
   */
  static updateArrayDocTimestamps(arrayDoc: {}[]): Array<{}> {
    const newArrayDoc = [];
    for (let item of arrayDoc) {
      let newItem = { ...item, createdAt: new Date(), updatedAt: new Date() };

      newArrayDoc.push(newItem);
    }

    return newArrayDoc;
  }
}
