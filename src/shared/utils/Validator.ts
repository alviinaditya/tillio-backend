import { ZodType } from "zod";

class Validator {
  static validate<T>(schema: ZodType<T>, data: T) {
    return schema.parse(data);
  }
}

export default Validator;
