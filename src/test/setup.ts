import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../lib/ifa/collection");

let mongo: any;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  const dbName = "test";
  const connectString = `${mongoUri}${dbName}`;

  const mongoClient = new MongoClient(connectString);

  let dbData = (global as any).dbData;

  const collectionName = "users";

  const collectionData = {
    username: { type: "string", required: true },
    password: { type: "number", required: true },
  };

  const timestamps = { timestamps: true };

  (global as any).dbData = {
    connectionString: mongoUri,
    client: mongoClient,
    collectionName,
    dbName,
    options: collectionData,
    timestamps,
    ...dbData,
  };
});

afterAll(async () => {
  await mongo.stop();
  const dbData = (global as any).dbData;
  const { client } = dbData;
  client.close();
});
