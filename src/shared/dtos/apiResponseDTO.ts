// Base interface for API responses
export interface BaseApiResponseDTO<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: any;
}

// Paginated metadata for responses with pagination
export interface PaginationMetadataDTO {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

// API response with pagination that extends the base response
export interface ApiResponseWithPaginationDTO<T> extends BaseApiResponseDTO<T> {
  pagination: PaginationMetadataDTO;
}

// Simple API response without pagination
export interface ApiResponseDTO<T> extends BaseApiResponseDTO<T> {}
