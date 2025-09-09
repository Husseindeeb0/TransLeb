import type { AxiosRequestConfig, AxiosError } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { axiosInstance } from "./axiosInstance";

export const axiosBaseQuery =
  (): BaseQueryFn<
    { url: string; method: AxiosRequestConfig["method"]; data?: any },
    unknown,
    unknown
  > =>
  async ({ url, method, data }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data: { coordinate: data },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
