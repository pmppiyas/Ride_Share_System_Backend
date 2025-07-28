import { Response } from "express";

interface DMeta {
  total: number;
}

interface DResponse<D> {
  statusCode: number;
  success: boolean;
  message: string;
  data: D;
  meta?: DMeta;
}

const sendResponse = <D>(res: Response, data: DResponse<D>) => {
  if (res.headersSent) return;

  res.status(data.statusCode).send({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
