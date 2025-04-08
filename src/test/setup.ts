import { MongoClient, Timestamp } from "mongodb";
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

// beforeEach(async () => {
//   const collections = await mongoose.connection.db?.collections();

//   for (let collection of collections!) {
//     await collection.deleteMany({});
//   }
// });

// afterAll(async () => {
//   //   await mongo.stop();
//   //   await mongoose.connection.close();
// });

// (global as any).signin = (id?: string) => {
//   // Build a JWT payload.  { id, email }
//   const payload = {
//     id: id || new mongoose.Types.ObjectId().toHexString(),
//     email: "test@test.com",
//   };

//   // Create the JWT!
//   const token = jwt.sign(payload, process.env.JWT_KEY!);

//   // Build session Object. { jwt: MY_JWT }
//   const session = { jwt: token };

//   // Turn that session into JSON
//   const sessionJSON = JSON.stringify(session);

//   // Take JSON and encode it as base64
//   const base64 = Buffer.from(sessionJSON).toString("base64");

//   // return a string thats the cookie with the encoded data
//   return [`session=${base64}`];
// };
