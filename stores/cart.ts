import { defineStore } from "pinia";
import { useMenu } from "./menu";
import { useApi } from "../composables/useApi";

export const useCart = defineStore("cart", {
    state: () => {
        return {
            isAddLoading: false,
            isLoading: false,
            isRemoving: false,
            isEmptying: false,
            products: [],
            loyalty_points: {},
            payment_methods: [],
            working_times: [],
            title: "",
            sub_title: "",
            message: "",
            subtotal: 0,
            vat: 0,
            discount: 0,
            service_cost: 0,
            total: 0
        }
    },
    getters: {
        getProducts(state) {
            return state.products ?? [];
        },
        getProductsCount(state) {
            return state.products.length;
        },
        getAvailablePaymentMethods(state) {
            return state.payment_methods ?? [];
        },
        getSubtotal(state) {
            return state.subtotal;
        },
        getVat(state) {
            return state.vat;
        },
        getDiscount(state) {
            return state.discount;
        },
        getServiceCost(state) {
            return state.service_cost;
        },
        getTotal(state) {
            return state.total;
        }
    },
    actions: {
      fetchCart() {
          this.$state.isLoading = true;
          return useApi(`cart`, {
              method: "GET"
          },
          {
              onSuccess: (data: any) => {
                  // Update cart state with data from API
                  this.$state.products = data.data.products || [];
                  this.$state.loyalty_points = data.data.loyalty_points || {};
                  this.$state.payment_methods = data.data.payment_methods || [];
                  this.$state.working_times = data.data.working_times || [];
                  this.$state.title = data.data.cart_title || "";
                  this.$state.sub_title = data.data.cart_title_sub_message || "";
                  this.$state.message = data.data.message || "";

                  // Update pricing information
                  this.$state.subtotal = data.data.sub_total || 0;
                  this.$state.vat = data.data.tax_amount || 0;
                  this.$state.discount = (data.data.promo_discount || 0) + (data.data.extra_discount || 0) + (data.data.gift_card_discount || 0);
                  this.$state.service_cost = data.data.order_service_fees_price || 0;
                  this.$state.total = data.data.total || 0;

                  this.$state.isLoading = false;
              },
              onError: (err: any) => {
                  this.$state.isLoading = false;
                  console.error("Error fetching cart:", err);
              }
          });
      },
      emptyCart() {
          this.$state.isEmptying = true;
          return useApi(`delete-all-cart`, {
              method: "DELETE"
          },
          {
              onSuccess: (data: any) => {
                  // Clear cart data
                  this.$state.products = [];
                  this.$state.subtotal = 0;
                  this.$state.vat = 0;
                  this.$state.discount = 0;
                  this.$state.service_cost = 0;
                  this.$state.total = 0;
                  this.$state.isEmptying = false;

                  // Show success message if available
                  if (data && data.message) {
                      console.log('Cart emptied successfully:', data.message);
                  }

                  // Refresh cart data to ensure UI is in sync with server
                  this.fetchCart();
              },
              onError: (err: any) => {
                  this.$state.isEmptying = false;
                  console.error("Error emptying cart:", err);
              }
          });
      },
      addOrUpdateServiceInCart(service: any, branchId = null) {
          const menuModule = useMenu();
          this.$state.isAddLoading = true;

          // Determine if this is an update operation
          const isUpdate = service.cart_product_id && service.cart_product_id !== undefined;

          if (isUpdate) {
              console.log('Updating existing cart item:', service.cart_product_id);

              // For updates, use the same endpoint as adding but include cart_product_id
              // The API will detect this is an update operation based on the cart_product_id
              const updateRequestBody: any = {
                  product_id: service.id,
                  quantity: 1,
                  branch_id: branchId ?? service.branch_id ?? menuModule.branch_id,
                  cart_product_id: service.cart_product_id // Include this for the API to identify as update
              };

              // Include any additional data needed for the update
              if (service.selectedExtension) {
                  updateRequestBody.selectedExtension = service.selectedExtension;
              }
              if (service.selectedTime) {
                  updateRequestBody.selectedTime = service.selectedTime;
              }
              if (service.date) {
                  updateRequestBody.date = service.date;
              }

              console.log('Cart update API request body:', updateRequestBody);

              // Use POST method with the cart endpoint for both add and update
              return useApi(`cart`, {
                     method: "POST",
                     body: updateRequestBody
                  },
              {
                  onSuccess: (data: any) => {
                      console.log('Cart API response:', data);

                      // Update cart with new data
                      if (data.data) {
                          this.$state.products = data.data.products || this.$state.products;
                          this.$state.subtotal = data.data.subtotal || this.$state.subtotal;
                          this.$state.vat = data.data.vat || this.$state.vat;
                          this.$state.total = data.data.total || this.$state.total;
                      }
                      this.$state.isAddLoading = false;
                      // Refresh cart data
                      this.fetchCart();
                  },
                  onError: (err: any) => {
                      this.$state.isAddLoading = false;
                      console.error("Error updating cart:", err);
                  }
              });
          } else {
              console.log('Adding new item to cart');

              // For adding new items, use the standard cart endpoint with POST
              const addRequestBody: any = {
                  product_id: service.id,
                  quantity: 1,
                  branch_id: branchId ?? service.branch_id ?? menuModule.branch_id
              };

              // Include any additional data for the new item
              if (service.selectedExtension) {
                  addRequestBody.selectedExtension = service.selectedExtension;
              }
              if (service.selectedTime) {
                  addRequestBody.selectedTime = service.selectedTime;
              }
              if (service.date) {
                  addRequestBody.date = service.date;
              }

              console.log('Cart add API request body:', addRequestBody);

              return useApi(`cart`, {
                     method: "POST",
                     body: addRequestBody
                  },
              {
                  onSuccess: (data: any) => {
                      console.log('Cart API response:', data);

                      // Update cart with new data
                      if (data.data) {
                          this.$state.products = data.data.products || this.$state.products;
                          this.$state.subtotal = data.data.subtotal || this.$state.subtotal;
                          this.$state.vat = data.data.vat || this.$state.vat;
                          this.$state.total = data.data.total || this.$state.total;
                      }
                      this.$state.isAddLoading = false;
                      // Refresh cart data
                      this.fetchCart();
                  },
                  onError: (err: any) => {
                      this.$state.isAddLoading = false;
                      console.error("Error adding to cart:", err);
                  }
              });
          }
      },
      removeProduct(cartProductId: number | string) {
          console.log('Removing cart item:', cartProductId);
          this.$state.isRemoving = true;
          return useApi(`cart/${cartProductId}`, {
              method: "DELETE"
          },
          {
              onSuccess: (data: any) => {
                  // Remove product from local state
                  this.$state.products = this.$state.products.filter(
                      (product: any) => product.cart_product_id !== cartProductId
                  );

                  // Update pricing information if available in response
                  if (data.data) {
                      this.$state.subtotal = data.data.subtotal || this.$state.subtotal;
                      this.$state.vat = data.data.vat || this.$state.vat;
                      this.$state.total = data.data.total || this.$state.total;
                  }

                  this.$state.isRemoving = false;
                  // Refresh cart data
                  this.fetchCart();
              },
              onError: (err: any) => {
                  this.$state.isRemoving = false;
                  console.error("Error removing product:", err);
              }
          });
      }
    },
    persist: {
        storage: localStorage,
    },
});