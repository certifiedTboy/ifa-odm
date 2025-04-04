import { MongoClient } from "mongodb";
export declare function connect(): Promise<void>;
export declare function createCollection(client: MongoClient, dbName: string, collectionName: string, collectionProps: any): Promise<void>;
