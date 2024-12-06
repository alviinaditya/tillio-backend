import { Response } from "express";
import {
  ApiResponseDTO,
  ApiResponseWithPaginationDTO,
  PaginationMetadataDTO,
} from "../dtos/apiResponseDTO";

export function createResponse<T>(
  res: Response,
  option: {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error?: any | null;
    pagination?: PaginationMetadataDTO;
  }
): Response<ApiResponseDTO<T> | ApiResponseWithPaginationDTO<T>> {
  const { statusCode, success, message, data, error, pagination } = option;
  // Base response object
  const baseResponse: ApiResponseDTO<T> = {
    success,
    message,
    data,
    error,
  };

  // If pagination is provided, include it in the response
  if (pagination) {
    const paginatedResponse: ApiResponseWithPaginationDTO<T> = {
      ...baseResponse,
      pagination,
    };
    return res.status(statusCode).json(paginatedResponse);
  }

  // If no pagination, return a standard response
  return res.status(statusCode).json(baseResponse);
}
