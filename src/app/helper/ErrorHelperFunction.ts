/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

interface errType {
  path: string;
  message: string;
}

export let errorSources: errType[] = [];
let errMode: any[] = [];
let missing: string[] = [];

const resetState = () => {
  errorSources = [];
  errMode = [];
  missing = [];
};

export const handleDuplicateError = (err: any) => {
  resetState();

  const keyValue = err.keyValue;
  if (keyValue) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return {
      message: `Duplicate ${field} "${value}" already exists`,
      statusCode: httpStatus.METHOD_FAILURE,
    };
  }

  return {
    message: "Duplicate value already exists",
    statusCode: httpStatus.METHOD_FAILURE,
  };
};

export const handleZodValidatonError = (err: any) => {
  resetState();

  if (!err || !err.errors || typeof err.errors !== "object") {
    return {
      message: err?.issues?.[0]?.message || "Zod validation failed",
      statusCode: httpStatus.BAD_REQUEST,
    };
  }

  const errors = Object.values(err.errors);
  errors.forEach((errObj: any) => {
    const path = Array.isArray(errObj.path) ? errObj.path[0] : errObj.path;

    errorSources.push({
      path: path,
      message: errObj.message,
    });

    if (path) {
      missing.push(path);
    }

    errMode.push(errObj);
  });

  const capitalizedFields = missing
    .map((item: string) =>
      item ? item.charAt(0).toUpperCase() + item.slice(1) : "Field"
    )
    .join(", ");

  const prefix =
    errMode[0]?.received === "undefined"
      ? "Missing required field"
      : "Wrong value in";

  return {
    message: `${prefix}: ${capitalizedFields}`,
    statusCode: httpStatus.BAD_REQUEST,
  };
};

export const validationError = (err: any) => {
  resetState();

  const errors = Object.values(err.errors || {});
  const formattedErrors: { path: string; message: string }[] = [];

  errors.forEach((errObj: any) => {
    formattedErrors.push({
      path: errObj.path,
      message: errObj.message,
    });
    errorSources.push({
      path: errObj.path,
      message: errObj.message,
    });
  });

  const missingFields = formattedErrors.map((e) => e.path).join(", ");
  const messages = formattedErrors.map((e) => e.message).join(" | ");

  return {
    message: `Validation failed on: ${missingFields} → ${messages}`,
    statusCode: httpStatus.BAD_REQUEST,
  };
};
