export class MongodbError extends Error {
  readonly type: string = "MongodbError";
  constructor(message: string) {
    super(message);
  }
}
