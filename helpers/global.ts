import sqlite from "node:sqlite";
import { MongoClient } from "mongodb";

const database = new sqlite.DatabaseSync(":memory:");

database.exec(`
    CREATE TABLE data(
      key INTEGER PRIMARY KEY,
      dbName TEXT,
      connectionString TEXT
    ) STRICT
  `);

export const setGlobalData = async (dbData: {
  connectionString: string;
  dbName: string;
  client: MongoClient;
}) => {
  const insert = database.prepare(
    "INSERT INTO data (key, dbName, connectionString) VALUES (?, ?, ?)"
  );
  insert.run(1, dbData.dbName, dbData.connectionString);
};

export const getGlobalData = () => {
  const query = database.prepare("SELECT * FROM data");
  // Execute the prepared statement and log the result set.
  console.log(query.all());
};
