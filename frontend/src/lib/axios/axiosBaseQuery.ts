import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";

// Create a base query using Axios
export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    { url: string; method: AxiosRequestConfig["method"]; data?: any },
    unknown,
    unknown
  > =>
  async ({ url, method, data }) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
