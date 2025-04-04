"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredFields = exports.getCollectionProps = exports.getUniqueProps = void 0;
/**
 * @method getUniqueProps
 * @description This method returns an object containing the unique properties of the collection
 * @param {Object} collectionData
 * @returns {Object}
 */
function getUniqueProps(collectionData) {
    let uniqueProps = {};
    const collectionDataItems = Object.keys(collectionData);
    for (let collectionKey of collectionDataItems) {
        if (!uniqueProps[collectionKey] && collectionData[collectionKey].unique) {
            uniqueProps[collectionKey] = Object.assign(Object.assign({}, collectionData[collectionKey]), { bsonType: (collectionData[collectionKey].type =
                    collectionData[collectionKey].type) });
        }
    }
    return uniqueProps;
}
exports.getUniqueProps = getUniqueProps;
/**
 * @method getCollectionProps
 * @description This method returns an object containing the acceptable properties for a mongodb collection
 * @param {Object} collectionData
 * @returns {Object}
 */
function getCollectionProps(collectionData) {
    let collectionProps = {};
    const collectionDataItems = Object.keys(collectionData);
    for (let collectionKey of collectionDataItems) {
        if (!collectionProps[collectionKey]) {
            collectionProps[collectionKey] = Object.assign(Object.assign({}, collectionData[collectionKey]), { bsonType: (collectionData[collectionKey].type =
                    collectionData[collectionKey].type) });
            delete collectionProps[collectionKey].required;
            delete collectionProps[collectionKey].type;
            delete collectionProps[collectionKey].unique;
        }
    }
    return collectionProps;
}
exports.getCollectionProps = getCollectionProps;
/**
 * @method getRequiredFields
 * @description This method returns an array containing the required fields of the collection
 * @param {Object} collectionData
 * @returns {Array}
 */
function getRequiredFields(collectionData) {
    let requiredFields = [];
    for (let key in collectionData) {
        if (collectionData[key].required) {
            requiredFields.push(key);
        }
    }
    return requiredFields;
}
exports.getRequiredFields = getRequiredFields;
