const UNKNOWN_ERROR = "Internal server error";

const TAG = "utils.js ";
/**
 * determines if a request has the expected authorization is its headers to allow write privileges
 * @param req http or https request
 * @returns boolean
 */

function handleUnknownError(res: any, error: any) {
  console.log(TAG, "Error:", error);
  res.status(500);
  res.send({ error: UNKNOWN_ERROR });
}

export { handleUnknownError };
