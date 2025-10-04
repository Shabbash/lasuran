import { defineStore } from "pinia";
import { useCart } from '~/stores/cart'

interface MenuParams {
    category_id: string | number | null;
    sub_category_id: string | number | null;
    branch_id: string | number | null;
}
export const useMenu = defineStore("menu", {
    state: () => {
        return {
            category_id: null,
            sub_category_id: null,
            is_custom_menu: true,
            category_query_type: null,
            branch_id: null,
            menu_id: null,
            menus: {
                data: [],
                loading: true,
            },
            services: {
                data: [],
                loading: true,
                pagination_options: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 10,
                    total: 0,
                }
            },
            branches: {
                data: [],
                loading: true,
            },
            service: {
                data: {},
                item: {},
                times: [],
                loading: true,
            },
        }
    },
    getters: {
        getMenus(state) {
            return state.menus.data ?? [];
        },
        getBranches(state) {
            return state.branches.data ?? [];
        },
        getSelectedMenu(state) {
            return this.getMenus.find((menu: {}) => menu.id === state.menu_id) ?? {};
        },
        getCategories(state) {
            return this.getSelectedMenu.menu_categories ?? [];
        },
        getSelectedCategory(state) {
            return this.getCategories.find((el: any) => el.id === state.category_id) ?? {};
        },
        getSubCategories(state) {
            return this.getSelectedCategory.children ?? [];
        },
        getFlatMapCategories(state) {
            return this.getMenus.flatMap((el: any) => el.menu_categories).flatMap((el: any) => el.children);
        },
        getServices(state) {
            return state.services.data ?? [];
        },
        getService(state) {
            return state.service;
        },
        getMenuParams(state) {
            return {
                category_id: state.category_id,
                sub_category_id: state.sub_category_id,
                branch_id: state.branch_id,
            }
        },
        isServicesLoading(state) {
            return state.services.loading;
        }

    },
    actions: {
        async initMenu() {
            this.fetchBranches();
            await this.fetchMenus();
            this.fetchServices();
        },
        fetchBranches() {
            this.$state.branches.loading = true;
            return useApi("branches", { params: {} },
                {
                    onSuccess: (data: any) => {
                        this.$state.branches.data = data.data;
                        this.$state.branches.loading = false;
                        // this.$state.branch_id = data.data.branch_id;
                        // this.$state.is_custom_menu = data.data.is_custom_menu;
                        // this.$state.category_query_type = data.data.category_query_type;
                        // this.setDefaultMenu();
                    },
                    onError: (err: any) => {
                        this.$state.branches.loading = false;
                    }
                });
        },
        fetchMenus() {
            const params: {} = {
                category_id: this.$state.category_id,
                sub_category_id: this.$state.sub_category_id,
                branch_id: this.$state.branch_id

            };
            this.$state.menus.loading = true;
            return useApi("menus", {
                params
            },
                {
                    onSuccess: (data: any) => {
                        this.$state.menus.data = data.data.menus;
                        this.$state.menus.loading = false;
                        this.$state.branch_id = data.data.branch_id;
                        this.$state.is_custom_menu = data.data.is_custom_menu;
                        this.$state.category_query_type = data.data.category_query_type;
                        if (!this.$state.category_id || !this.$state.sub_category_id)
                            this.setDefaultMenu();
                        console.log(data.data.menus);
                    },
                    onError: (err: any) => {
                        this.$state.menus.loading = false;
                    }
                });
        },
        setDefaultMenu() {
            this.$state.menu_id = this.$state.menus.data?.[0]?.id;
            this.setDefaultCategory();
            this.setDefaultSubCategory();
        },
        setMenuParams(params: any) {
            console.log('setMenuParams', params);
            this.$state.category_id = params.category_id;
            // this.$state.sub_category_id = params.sub_category_id;
            // this.$state.branch_id = params.branch_id;
        },
        // fetchServices() {
        //     const params: {} = this.getMenuParams;
        //     this.$state.services.loading = true;
        //     return useApi("products", {
        //         params
        //     },
        //         {
        //             onSuccess: (data: any) => {
        //                 this.$state.services.data = data.data.products;
        //                 this.$state.services.loading = false;
        //             },
        //             onError: (err: any) => {
        //                 this.$state.services.loading = false;
        //             }
        //         });
        // },

        fetchServices(page = 1) {
            const params: any = {
                ...this.getMenuParams,
                page,
            };

            this.services.loading = true;
            this.currentPage = page;

            return useApi("products", { params }, {
                onSuccess: (data: any) => {
                    this.services.data = data.data.products;
                    this.services.pagination_options = data.data.pagination_options;
                    this.services.loading = false;
                },
                onError: (err: any) => {
                    this.services.loading = false;
                }
            });
        },


        fetchService(service: any = null, onResponse = null) {
            if (!service) service = this.$state.service.item;
            const params: {} = this.getMenuParams;
            this.$state.service.loading = true;
            return useApi(`products/${service.id}`, {},
                {
                    onSuccess: (data: any) => {
                        // Clean the API response to ensure no stale editing flags
                        const cleanedData = {
                            ...data.data,
                            _isEditing: undefined,
                            is_editing: undefined,
                            cart_product_id: undefined
                        };

                        // Remove undefined properties
                        Object.keys(cleanedData).forEach(key => {
                            if (cleanedData[key] === undefined) {
                                delete cleanedData[key];
                            }
                        });

                        this.$state.service.data = cleanedData;
                        this.$state.service.loading = false;
                        if (onResponse) onResponse();
                    },
                    onError: (err: any) => {
                        this.$state.service.loading = false;
                        if (onResponse) onResponse();
                    }
                });
        },
        setDefaultCategory() {
            this.$state.category_id = (this.getSelectedMenu.menu_categories ?? [])?.[0]?.id;
        },
        setDefaultSubCategory() {
            this.$state.sub_category_id = (this.getSubCategories ?? [])?.[0]?.id;
        },
        // Clear service state to prevent stale editing data
        clearServiceState() {
            this.$state.service = {
                data: {},
                item: {},
                times: [],
                loading: true,
            };
        },

        setService(service: any, onResponse:any = null ) {

            // Store the editing state and cart_product_id
            const isEditing = service._isEditing === true;
            const cartProductId = service.cart_product_id;

            // Clear any previous service state first to prevent stale data
            if (!isEditing || !cartProductId) {
                this.clearServiceState();
            }

            // Store the service item
            this.$state.service.loading = true;
            this.$state.service.item = service;

            // If this is an edit operation, store the service data directly
            if (isEditing && cartProductId) {
                this.$state.service.data = service;
                this.$state.service.loading = false;
                // Fetch the service details in the background
                this.fetchServiceForEdit(service,onResponse);

            } else {
                console.log("setService isEditing" , onResponse)

                // For regular operations, fetch the service as usual
                this.fetchService(service,onResponse);
            }
        },

        // Fetch service details for edit operations without overwriting the editing state
        fetchServiceForEdit(service: any, onResponse:any = null ) {
            const params: {} = this.getMenuParams;

            return useApi(`products/${service.id}`, {},
                {
                    onSuccess: (data: any) => {
                        // Merge the API data with our editing state
                        this.$state.service.data = {
                            ...data.data,
                            cart_product_id: service.cart_product_id,
                            _isEditing: true,
                            selectedExtension: service.selectedExtension || '',
                            selectedTime: service.selectedTime || '',
                            date: service.date || ''
                        };
                        if (onResponse instanceof Function) onResponse();
                    },
                    onError: (err: any) => {
                        if (onResponse instanceof Function) onResponse();
                        console.error('Error fetching service for edit:', err);
                    }
                });
        },
fetchServiceAvailableTimes(
  productMasterId?: number,
  opts?: {
    // Single fee (legacy support)
    feeId?: number | null;
    // Multiple fees (VIP: preferred)
    feeIds?: number[] | null;
    // Optional: address coupling (if backend uses it)
    feeAddressId?: number | null;
  }
) {
  this.$state.service.loading = true;

// Coerce product master id to a plain number
const rawId =
  productMasterId ??
  this.$state.service?.data?.product_master_id ??
  this.$state.service?.data?.id;

const pmId =
  typeof rawId === 'object'
    ? Number(rawId?.id ?? rawId?.product_master_id)
    : Number(rawId);

if (!pmId || Number.isNaN(pmId)) {
  console.error('fetchServiceAvailableTimes: invalid product master id', rawId);
  this.$state.service.loading = false;
  return Promise.resolve();
}

  // Pull defaults from cart store for backward compatibility
  const cart = useCart();
  const feeId = opts?.feeId ?? (cart as any).selectedServiceFeeId ?? null;
  const feeIds = Array.isArray(opts?.feeIds) ? opts!.feeIds! : (feeId ? [feeId] : []);
  const feeAddressId = opts?.feeAddressId ?? (cart as any).selectedServiceFeeAddressId ?? null;

  // Build query using the same structure your backend already accepts:
  // service_fees[0][id]=X&service_fees[1][id]=Y ...
  const sp = new URLSearchParams();

  // Use the flat array format the backend expects: service_fee_ids[]
if (feeIds.length) {
  feeIds.forEach((idVal) => idVal && sp.append('service_fee_ids[]', String(idVal)));
} else if (feeId) {
  sp.append('service_fee_ids[]', String(feeId));
}

// Optional: if your backend couples an address id to fees
if (feeAddressId) {
  sp.append('service_fee_address_id', String(feeAddressId));
}

const url = sp.toString()
  ? `product-masters/${pmId}/available-times?${sp.toString()}`
  : `product-masters/${pmId}/available-times`;
  
  return useApi(url, {}, {
    onSuccess: (data: any) => {
      // ✅ Store slots (dates+times)
      this.$state.service.loading = false;
      this.$state.service.times = data.data;
      console.log('✅ fetchServiceAvailableTimes success:', { url, timesCount: data?.data?.length ?? 0 });
    },
    onError: (err: any) => {
      console.error('❌ Error fetching available times:', err);
      this.$state.service.loading = false;
    }
  });
}



    },

    persist: true,
});