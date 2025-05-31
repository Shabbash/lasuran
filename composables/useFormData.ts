/**
 * Composable for handling form data conversion
 * Converts regular objects to FormData when needed (for file uploads)
 * Keeps JSON format for regular data
 */

export const useFormData = () => {
  
  /**
   * Check if the data contains any File objects
   * @param data - The data object to check
   * @returns boolean - true if contains files, false otherwise
   */
  const hasFileUpload = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;
    
    return Object.values(data).some(value => value instanceof File);
  };

  /**
   * Convert object to FormData
   * @param data - The data object to convert
   * @returns FormData - The converted FormData object
   */
  const toFormData = (data: any): FormData => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          // Handle file uploads
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          // Handle arrays
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item);
            } else {
              formData.append(`${key}[${index}]`, String(item));
            }
          });
        } else {
          // Handle regular values
          formData.append(key, String(value));
        }
      }
    });
    
    return formData;
  };

  /**
   * Prepare data for API request
   * Returns FormData for file uploads, JSON for regular data
   * @param data - The data to prepare
   * @returns object with body and headers
   */
  const prepareRequestData = (data: any) => {
    const hasFiles = hasFileUpload(data);
    
    if (hasFiles) {
      // Use FormData for file uploads
      const formData = toFormData(data);
      
      return {
        body: formData,
        headers: {
          'Content-Type': undefined // Let browser set multipart/form-data with boundary
        },
        method: 'POST', // Use POST with _method override for file uploads
        needsMethodOverride: true
      };
    } else {
      // Use JSON for regular data
      return {
        body: data,
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT', // Use proper PUT method for regular updates
        needsMethodOverride: false
      };
    }
  };

  /**
   * Add method override to FormData for Laravel
   * @param formData - The FormData object
   * @param method - The HTTP method to override to
   */
  const addMethodOverride = (formData: FormData, method: string = 'PUT') => {
    formData.append('_method', method);
    return formData;
  };

  /**
   * Clean data by removing empty values
   * @param data - The data object to clean
   * @param keepFiles - Whether to keep file fields even if empty
   * @returns cleaned data object
   */
  const cleanData = (data: any, keepFiles: boolean = true): any => {
    const cleaned: any = {};
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value instanceof File) {
        // Always keep files if keepFiles is true
        if (keepFiles) {
          cleaned[key] = value;
        }
      } else if (value !== undefined && value !== null && value !== '') {
        // Keep non-empty values
        cleaned[key] = value;
      }
    });
    
    return cleaned;
  };

  return {
    hasFileUpload,
    toFormData,
    prepareRequestData,
    addMethodOverride,
    cleanData
  };
};
