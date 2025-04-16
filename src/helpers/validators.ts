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
  private static validateDate(date: Date): boolean {
    try {
      const yy = String(date.getFullYear()).slice(-2);
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-based
      const dd = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${yy}-${mm}-${dd}`;
      let newDate = new Date(formattedDate);
      return !isNaN(newDate.getTime());
    } catch (error) {
      throw new CustomError("InvalidDate", "Invalid date provided");
    }
  }
  static validateObjectId(id: string | ObjectId): void {
    if (!ObjectId.isValid(id)) {
      throw new CustomError("InvalidObjectId", "Invalid ObjectId provided");
    }
  }

  static validateArrayDoc(arrayData: any[]): void {
    if (!Array.isArray(arrayData) || arrayData.length <= 0) {
      throw new CustomError("InvalidArray", "Invalid array provided");
    }
  }

  static validateDoc(doc: {}): void {
    if (typeof doc !== "object" || Object.keys(doc).length === 0) {
      throw new CustomError("InvalidDoc", "Invalid document provided");
    }
  }

  static validateQueryDoc(doc: {}): void {
    if (typeof doc !== "object" || Object.keys(doc).length === 0) {
      throw new CustomError("InvalidQuery", "Invalid query provided");
    }
  }

  static validateDocProps(options: any, doc: any): void {
    const optionKeys = Object.keys(options);

    for (let key of optionKeys) {
      if (key === "createdAt" || key === "updatedAt") {
        if (this.validateDate(doc[key])) {
          throw new CustomError("InvalidDate", "Invalid date provided");
        }
      } else {
        if (doc[key] && typeof doc[key] !== options[key].type) {
          throw new CustomError(
            "SchemaValidationError",
            "Schema validation failed"
          );
        }
      }
    }
  }

  static validateUpdateDocProps(options: any, doc: any): void {
    const optionKeys = Object.keys(options);

    for (let key of optionKeys) {
      if (doc[key] && typeof doc[key] !== options[key].type) {
        throw new CustomError(
          "SchemaValidationError",
          "Schema validation failed"
        );
      }
    }
  }
}
