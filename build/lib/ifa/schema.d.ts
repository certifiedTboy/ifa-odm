export declare class Schema {
    options: any;
    collectionName: string;
    constructor(collectionName: string, options: any, timestamps?: {
        timestamps: boolean;
    });
    create(options: any): Promise<any>;
    find(option?: any): Promise<any>;
    findOne(options: any): Promise<any>;
}
