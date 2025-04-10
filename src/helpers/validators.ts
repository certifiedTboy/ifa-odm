import { ObjectId } from "mongodb";
import { CustomError } from "../lib/errors/CustomError";

/**
 * @class Validator
 * @description A class that provides validation methods for MongoDB ObjectId and documents.
 * @static validateObjectId - Validates if the provided id is a valid MongoDB ObjectId.
 * @static validateArrayDoc - Validates if the provided data is an array.
 * @static validateDoc - Validates if the provided data is an object.
 * @static validateDocProps - Validates if the provided document has valid collection properties and is not empty.
 */
export class Validator {
  static validateObjectId(id: ObjectId): void {
    if (!ObjectId.isValid(id)) {
      throw new CustomError("InvalidObjectId", "Invalid ObjectId provided");
    }
  }

  static validateArrayDoc(arrayData: {}[]): void {
    if (!Array.isArray(arrayData)) {
      throw new CustomError("InvalidArray", "Invalid array provided");
    }
  }

  static validateDoc(doc: {}): void {
    if (typeof doc !== "object") {
      throw new CustomError("InvalidDoc", "Invalid document provided");
    }
  }

  static validateDocProps(options: any, doc: any): void {
    if (Object.keys(doc).length === 0) {
      throw new CustomError("EmptyDoc", "Document is empty");
    }

    if (
      Object.keys(options).every((key) => typeof doc[key] !== options[key].type)
    ) {
      throw new CustomError(
        "SchemaValidationError",
        "Schema validation failed"
      );
    }
  }
}
