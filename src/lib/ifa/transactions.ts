class Transaction {
  transactionSession: any;
  operations: any[] = [];
  createTransactionSession() {
    const { client } = (global as any).dbData;

    this.transactionSession = client.startSession();
  }

  runWithTransaction(operation: () => Promise<any>) {
    this.operations.push(operation);

    return this;
  }

  exec() {
    try {
      return this.transactionSession.withTransaction(async () => {
        for (const operation of this.operations) {
          await operation();
        }
      });
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        console.error("Transaction failed: ", error.message);
      } else {
        console.error("Transaction failed: ", error);
      }
    } finally {
      this.transactionSession.endSession();
      this.transactionSession = null;
      this.operations = [];
      console.log("Transaction session ended");
    }
  }
}

export { Transaction };
