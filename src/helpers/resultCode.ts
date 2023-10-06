const CODE = {
  SUCCESS: "00",
  EMPTY_MANDATORY: "01",
  INVALID_PARAMETER: "02",
  DATA_NOT_FOUND: "03",
  RENT_NOT_ALLOWED: "04",
  RENT_SUSPEND: "05",
  FIREBASE_STORE_ERROR: "06",
  STOCK_OFFSIDE: "07",
};

const resultCode = (type: string, code: string, fieldName?: string) => {
  return JSON.parse(`{
    "resultCode": "${type + code}",
    "message": "${
      code == "00"
        ? "Success"
        : code == "01"
        ? `Empty Mandatory Parameter ${fieldName}`
        : code == "02"
        ? `Invalid Parameter ${fieldName}`
        : code == "03"
        ? `No Data Found ${fieldName}`
        : code == "04"
        ? `Rent Not Allowed more than ${fieldName}`
        : code == "05"
        ? `Rent Suspend until ${fieldName}`
        : code == "06"
        ? `Error create or update firebase ${fieldName} Document`
        : code == "07"
        ? `BookID ${fieldName} is out of stock`
        : ""
    }"
  }`);
};

export { CODE, resultCode };
