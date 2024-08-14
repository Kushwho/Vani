export type ApiError = {
  statusCode: number;
  message: string;
  errors: string[];
  success: boolean;
};
