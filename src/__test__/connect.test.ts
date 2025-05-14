import { Ifa } from "../lib/ifa/model";

describe("connect function", () => {
  it("should connect to the database", async () => {
    const { connectionString, dbName } = (global as any).dbData;

    const ifa = new Ifa(connectionString, dbName);

    const response = await ifa.connect();

    expect(response).toEqual(dbName);
  });
});
