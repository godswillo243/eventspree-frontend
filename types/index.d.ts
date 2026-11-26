export type ApiSuccessResponse<TData = unknown, TMeta = unknown> = {
  success: true;
  data: TData;
  message: string;
  meta?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export type TUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "suspended";
  role: "user" | "admin" | "moderator" | "support";
  emailVerifiedAt?: string;
};

export {};
