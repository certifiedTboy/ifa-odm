"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaHelper = void 0;
class SchemaHelper {
    /**
     * @method getUniqueProps
     * @description This method returns an object containing the unique properties of the collection
     * @param {Object} collectionData
     * @returns {Object}
     */
    static getUniqueProps(collectionData) {
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
    /**
     * @method getCollectionProps
     * @description This method returns an object containing the acceptable properties for a mongodb collection
     * @param {Object} collectionData
     * @returns {Object}
     */
    static getCollectionProps(collectionData) {
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
    /**
     * @method getRequiredFields
     * @description This method returns an array containing the required fields of the collection
     * @param {Object} collectionData
     * @returns {Array}
     */
    static getRequiredFields(collectionData) {
        let requiredFields = [];
        for (let key in collectionData) {
            if (collectionData[key].required) {
                requiredFields.push(key);
            }
        }
        return requiredFields;
    }
}
exports.SchemaHelper = SchemaHelper;
