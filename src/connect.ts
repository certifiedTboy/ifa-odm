import { MongoClient } from "mongodb";
import { CustomError } from "./lib/errors/CustomError";

export class Ifa {
  connectionString: string;
  dbName?: string;
  client: MongoClient;
  constructor(connectionString: string, dbName?: string) {
    this.connectionString = dbName
      ? `${connectionString}${dbName}`
      : connectionString;
    this.dbName = dbName;
    this.client = new MongoClient(this.connectionString);

    (globalThis as any).dbData = {
      connectionString: this.connectionString,
      dbName: this.dbName,
      client: this.client,
    };
  }
  async connect() {
    try {
      if (this.dbName) {
        await this.client.connect();
      } else {
        await this.client.connect();
        const db = this.client.db().databaseName;

        if (db) {
          this.dbName = db;
        }
      }
    } catch (error) {
      throw new CustomError(
        "DatabaseConnectionError",
        "database connection failed"
      );
    }
  }

  private getRequiredFields(collectionData: any) {
    let requiredFields: string[] = [];
    for (let key in collectionData) {
      if (collectionData[key].required) {
        requiredFields.push(key);
      }
    }

    return requiredFields;
  }

  private getCollectionProps(collectionData: any) {
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

  private getUniqueProps(collectionData: any) {
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

  async createCollection(collectionName: string, collectionProps: any) {
    try {
      const validationSchema = {
        $jsonSchema: {
          bsonType: "object",
          required: this.getRequiredFields(collectionProps.options),
          properties: this.getCollectionProps(collectionProps.options),
        },
      };

      const existingCollections = await this.client
        .db(this.dbName)
        .listCollections()
        .toArray();

      if (
        existingCollections?.length > 0 &&
        existingCollections.some(
          (collection) => collection.name === collectionName
        )
      ) {
        await this.client.db(this.dbName).command({
          collMod: collectionName,
          validator: validationSchema,
          validationLevel: "strict",
        });

        const uniqueProps = this.getUniqueProps(collectionProps.options);

        for (let data in uniqueProps) {
          await this.client
            .db(this.dbName)
            .collection(collectionName)
            .createIndex({ [data]: 1 }, { unique: true });
        }

        return;
      }

      await this.client.db(this.dbName).createCollection(collectionName);

      await this.client.db(this.dbName).command({
        collMod: collectionName,
        validator: validationSchema,
        validationLevel: "strict",
      });

      const uniqueProps = this.getUniqueProps(collectionProps.options);

      for (let data in uniqueProps) {
        await this.client
          .db(this.dbName)
          .collection(collectionName)
          .createIndex({ [data]: 1 }, { unique: true });
      }
    } catch (error) {
      console.log(error);
      throw new CustomError(
        "DatabaseCollectionError",
        "collection creation failed"
      );
    }
  }
}
