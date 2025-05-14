import { CustomError } from "../lib/errors/CustomError";

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

    const collectionDataKeys = Object.keys(collectionData);

    // loop over the collectionData keys
    for (let collectionKey of collectionDataKeys) {
      // check if the collectionData is an array
      if (Array.isArray(collectionData[collectionKey])) {
        // check if the collectionData is an array of objects
        if (collectionData[collectionKey][0].type) {
          collectionProps[collectionKey] = {
            bsonType: "array",
            items: {
              bsonType:
                collectionData[collectionKey][0].type === "ref"
                  ? "objectId"
                  : collectionData[collectionKey][0].type,
            },
          };
        } else {
          collectionProps[collectionKey] = {
            bsonType: "array",

            items: {
              bsonType: "object",
              properties: {},
            },
          };

          for (let item of collectionData[collectionKey]) {
            for (let key in item) {
              if (!collectionProps[collectionKey].items.properties[key]) {
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
                  bsonType: collectionData[collectionKey][item].type,
                };
                delete collectionProps[collectionKey].properties[item].type;
                delete collectionProps[collectionKey].properties[item].required;
                delete collectionProps[collectionKey].properties[item].unique;
              }
            }
          } else {
            collectionProps[collectionKey] = {
              ...collectionData[collectionKey],
              bsonType:
                collectionData[collectionKey].type === "ref"
                  ? "objectId"
                  : collectionData[collectionKey].type,
            };

            delete collectionProps[collectionKey].required;
            delete collectionProps[collectionKey].type;
            delete collectionProps[collectionKey].unique;
            delete collectionProps[collectionKey].ref;
            delete collectionProps[collectionKey].refField;
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
   */
  static updateDocTimestamps(doc: object) {
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

  /**
   * @method getRefDocs
   * @description This method returns an array of documents from a reference collection
   * @param {object} options - The options is the collection schema info
   * @param {string[]} refFields - An array of all related data to the collection
   * @param {object} query - The query to be used to find the documents in the reference collection
   * @returns {Array} - An array of documents from the reference collection
   */
  static getRefDocs(
    options: any,
    refFields: string[],
    query?: object,
    project?: any
  ) {
    let refDocs: any[] = [];

    for (const index in refFields) {
      let $lookup: {
        from?: string;
        localField?: string;
        foreignField?: string;
        as?: string;
        pipeline?: Array<object>;
      } = {};

      if (Array.isArray(options[refFields[index]])) {
        $lookup = {
          from: options[refFields[index]][0].ref,
          localField: refFields[index],
          foreignField: options[refFields[index]][0].refField,
          as: refFields[index],
        };

        if (project[index] && Object.keys(project[index]).length > 0) {
          $lookup = { ...$lookup, pipeline: [{ $project: project[index] }] };
        }

        refDocs.push({ $lookup });
      } else {
        $lookup = {
          from: options[refFields[index]].ref,
          localField: refFields[index],
          foreignField: options[refFields[index]].refField,
          as: refFields[index],
        };

        if (project[index] && Object.keys(project[index]).length > 0) {
          $lookup = { ...$lookup, pipeline: [{ $project: project[index] }] };
        }

        const $unwind = `$${refFields[index]}`;

        refDocs.push({ $lookup }, { $unwind });
      }
    }

    if (query && Object.keys(query).length > 0) {
      refDocs = [{ $match: query }, ...refDocs];
    }

    return refDocs;
  }
}
