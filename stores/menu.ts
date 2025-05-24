import { defineStore } from "pinia";

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
           services : {
               data: [],
               loading: true,
           },
           branches : {
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
        getMenus(state){
            return state.menus.data ?? [];
        },
        getBranches(state){
            return state.branches.data ?? [];
        },
        getSelectedMenu(state){
            return this.getMenus.find((menu : {}) => menu.id === state.menu_id) ?? {};
        },
        getCategories(state){
            return this.getSelectedMenu.menu_categories ?? [];
        },
        getSelectedCategory(state){
            return this.getCategories.find((el:any) => el.id === state.category_id) ?? {};
        },
        getSubCategories(state){
            return this.getSelectedCategory.children ?? [];
        },
        getServices(state)  {
            return state.services.data ?? [];
        },
        getService(state)  {
            return state.service;
        },
        getMenuParams(state){
            return {
                category_id: state.category_id,
                sub_category_id: state.sub_category_id,
                branch_id: state.branch_id,
            }
        },
        isServicesLoading(state){
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
          return  useApi("branches",{ params : {} },
              {
                  onSuccess: (data : any) => {
                      this.$state.branches.data = data.data;
                      this.$state.branches.loading = false;
                      // this.$state.branch_id = data.data.branch_id;
                      // this.$state.is_custom_menu = data.data.is_custom_menu;
                      // this.$state.category_query_type = data.data.category_query_type;
                      // this.setDefaultMenu();
                  },
                  onError: (err : any) => {
                      this.$state.branches.loading = false;
                  }
              });
      },
      fetchMenus() {
          const params :{} = {
              category_id: this.$state.category_id,
              sub_category_id: this.$state.sub_category_id,
          };
          this.$state.menus.loading = true;
          return  useApi("menus", {
                  params
              },
              {
                  onSuccess: (data : any) => {
                      this.$state.menus.data = data.data.menus;
                      this.$state.menus.loading = false;
                      this.$state.branch_id = data.data.branch_id;
                      this.$state.is_custom_menu = data.data.is_custom_menu;
                      this.$state.category_query_type = data.data.category_query_type;
                      this.setDefaultMenu();
                      console.log(data.data.menus);
                  },
                  onError: (err : any) => {
                      this.$state.menus.loading = false;
                  }
              });
      },
      setDefaultMenu(){
         this.$state.menu_id = this.$state.menus.data?.[0]?.id;
         this.setDefaultCategory();
         this.setDefaultSubCategory();
      },
      setMenuParams(params : any){
          console.log('setMenuParams',params);
          this.$state.category_id = params.category_id;
          // this.$state.sub_category_id = params.sub_category_id;
          // this.$state.branch_id = params.branch_id;
     },
      fetchServices() {
          const params :{} = this.getMenuParams;
          this.$state.services.loading = true;
          return  useApi("products", {
                  params
              },
              {
                  onSuccess: (data : any) => {
                      this.$state.services.data = data.data.products;
                      this.$state.services.loading = false;
                  },
                  onError: (err : any) => {
                      this.$state.services.loading = false;
                  }
              });
      },
      fetchService(service :any = null)  {
          if (!service) service = this.$state.service.item;
          const params :{} = this.getMenuParams;
          this.$state.service.loading = true;
          return  useApi(`products/${service.id}`, {},
              {
                  onSuccess: (data : any) => {
                      this.$state.service.data = data.data;
                      this.$state.service.loading = false;
                  },
                  onError: (err : any) => {
                      this.$state.service.loading = false;
                  }
              });
      },
      setDefaultCategory(){
          this.$state.category_id = ( this.getSelectedMenu.menu_categories ?? [])?.[0]?.id;
      },
      setDefaultSubCategory() {
          this.$state.sub_category_id = (this.getSubCategories ?? [])?.[0]?.id;
      },
      setService(service :any) {
          console.log('Setting service in menu store:', service);

          // Store the editing state and cart_product_id
          const isEditing = service._isEditing === true;
          const cartProductId = service.cart_product_id;

          // Store the service item
          this.$state.service.loading = true;
          this.$state.service.item = service;

          // If this is an edit operation, store the service data directly
          if (isEditing && cartProductId) {
              console.log('Edit operation detected, preserving service data');
              this.$state.service.data = service;
              this.$state.service.loading = false;

              // Fetch the service details in the background
              this.fetchServiceForEdit(service);
          } else {
              // For regular operations, fetch the service as usual
              this.fetchService();
          }
      },

      // Fetch service details for edit operations without overwriting the editing state
      fetchServiceForEdit(service :any) {
          const params :{} = this.getMenuParams;

          return useApi(`products/${service.id}`, {},
              {
                  onSuccess: (data : any) => {
                      // Merge the API data with our editing state
                      this.$state.service.data = {
                          ...data.data,
                          cart_product_id: service.cart_product_id,
                          _isEditing: true,
                          selectedExtension: service.selectedExtension || '',
                          selectedTime: service.selectedTime || '',
                          date: service.date || ''
                      };
                  },
                  onError: (err : any) => {
                      console.error('Error fetching service for edit:', err);
                  }
              });
        },
        fetchServiceAvailableTimes(){
          this.$state.service.loading = true;
            return useApi(`product-masters/${this.$state.service.data.id}/available-times`, {},
                {
                    onSuccess: (data : any) => {
                    console.log('fetchServiceAvailableTimes', data);
                    this.$state.service.loading = false;
                    this.$state.service.times = data.data;
                    },
                    onError: (err : any) => {
                        console.error('Error fetching service for edit:', err);
                        this.$state.service.loading = false;
                    }
                });
            // api/v1/product-masters/176/available-times
        }
    },

    persist: true,
});