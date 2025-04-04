export declare class SchemaHelper {
    /**
     * @method getUniqueProps
     * @description This method returns an object containing the unique properties of the collection
     * @param {Object} collectionData
     * @returns {Object}
     */
    static getUniqueProps(collectionData: any): any;
    /**
     * @method getCollectionProps
     * @description This method returns an object containing the acceptable properties for a mongodb collection
     * @param {Object} collectionData
     * @returns {Object}
     */
    static getCollectionProps(collectionData: any): any;
    /**
     * @method getRequiredFields
     * @description This method returns an array containing the required fields of the collection
     * @param {Object} collectionData
     * @returns {Array}
     */
    static getRequiredFields(collectionData: any): string[];
}
