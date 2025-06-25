
import type { UseApiCallbacks , RequestHeaders , RequestOptions} from '~/types/api';
import { useAuth } from '~/stores/auth';
import { useApp } from '~/stores/app';

export const useApi = (
  endpoint : string,
  options: RequestOptions,
  callbacks : UseApiCallbacks = {}
) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl ?? "https://lasuran-dev.jigsawme.io/api/v1/"
  const url = `https://lasuran-dev.jigsawme.io/api/v1/${endpoint}`;

  const toast = useToast()



 const headers: RequestHeaders = getRequestHeaders(options.headers, options.body);
//   if (callbacks.transformData) options.transform = callbacks.transformData;

  const requestOptions :RequestOptions = {
    headers,
    onResponse(response : any)  {
        let data = response?.response?._data;
      if (callbacks.onSuccess instanceof Function && data?.status) callbacks.onSuccess(data);
      else if(data?.status && options?.activateSuccessToast)
          toast.add({title : data?.message, color:'success'});

      return response;
    },
    onResponseError (error : any)  {
        if (error?.response?._data?.message)
            toast.add({title : error?.response?._data?.message, color:'error' });

        if (callbacks.onError instanceof Function) callbacks.onError(error);
        return error;
    },
    ...options,
  };
  return useAsyncData(
    options.key ?? Math.random().toString(),
    () => $fetch(url,requestOptions),
    {
      transform: requestOptions.transform,
      immediate: requestOptions.immediate,
    },
  );
}

export const getRequestHeaders = (headers : {} = {}, body?: any) => {
  const authStore = useAuth();
  const { getDeviceType , getServiceType , getDeliveryMethod , getLocale } = useApp();

  // Automatically detect FormData and adjust Content-Type
  const isFormData = body instanceof FormData;

  const defaultHeaders: any = {
    'Authorization': `Bearer ${authStore.getToken}`,
    'Service-Type': getServiceType,
    'Delivery-Method': getDeliveryMethod,
    'Device-Type': getDeviceType,
    'Accept-Language': getLocale,
  }

  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const mergedHeaders = {...defaultHeaders, ...(headers ?? {})};

  // Remove Content-Type if explicitly set to undefined (for FormData)
  if (mergedHeaders['Content-Type'] === undefined) {
    delete mergedHeaders['Content-Type'];
  }

  return mergedHeaders;
}

export { endPoints }
