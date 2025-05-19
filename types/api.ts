import type { AsyncDataOptions } from '#app';

export interface UseApiCallbacks {
  onError?: (error: Error) => void
  onSuccess?: (response: Response) => void,
  transformData?: (data: any) => any,
}

export interface RequestHeaders {
  "Content-Type": string,
  "Service-Type": string,
  "Delivery-Method": string,
  "Device-Type" : string,
}

export interface RequestOptions<DataT = any> extends AsyncDataOptions<DataT> {
  key?: string;
  method?: string;
  body?: any;
  headers?: {}
  onResponse?: (response: any) => void
  onResponseError?: (error: any) => void
}