import { HttpStatusCode } from "../constants/httpStatusCode";

class ResponseError extends Error {
  constructor(public status: HttpStatusCode, public message: string) {
    super(message);
  }
}

export default ResponseError;
