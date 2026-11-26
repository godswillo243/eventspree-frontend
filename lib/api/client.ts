import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 errors that haven't already been retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve: () => resolve(null), reject });
      })
        .then((token) => {
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark this request as being retried to prevent loops
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call your refresh endpoint (use a plain axios instance to avoid interceptor loops)
      await axiosInstance.post("/auth/refresh");

      // Process the queue with the new token
      processQueue(null);

      // Retry the original request
      // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed (e.g., refresh token expired) – log the user out
      processQueue(refreshError as Error);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
