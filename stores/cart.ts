import { defineStore } from "pinia";
import { useMenu } from "./menu";
import { useApi } from "../composables/useApi";

let paymentWindow: Window | null = null;
let paymentInterval: any = null;

export const useCart = defineStore("cart", {
    state: () => {
        return {
            isGiftCardApplyLoading: false,
            isPromoApplyLoading: false,
            params: {
                promo_code: null,
                gift_card: null,
                is_gifted_order: 0,
                gifted_order_data: {
                    first_name: '',
                    last_name: '',
                    mobile_code: '966',
                    mobile_number: '',
                    email: ''
                },
                gift_message: ''
            },
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
            total: 0,
            payment_method_id: null,
            order: {
                loading: true,
                data: {}
            },
            payment: {} as any,
            confirmation_message: {} as any,
            saved_cards: [],
            paymentAttempts: 20,
            paymentWindow: null as any,
            paymentInterval: null as any,
            cartServiceType: null as any
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
        },
        getPaymentMethods(state) {
            return state.payment_methods ?? [];
        },
        getSavedCards(state) {
            return state.saved_cards ?? [];
        },
        isOrderLoading(state) {
            return state.order.loading;
        },
        // Get the service type of current cart items
        getCurrentServiceType(state) {
            if (state.products.length === 0) return null;
            // Assume all items in cart have the same service type
            return state.cartServiceType || null;
        }

    },
    actions: {
        setPaymentMethod(paymentMethod: any) {
            this.$state.payment_method_id = paymentMethod;
        },
        // Reset loading states manually (useful for debugging or error recovery)
        resetLoadingStates() {
            this.$state.isAddLoading = false;
            this.$state.isLoading = false;
            this.$state.isRemoving = false;
            this.$state.isEmptying = false;
            this.$state.order.loading = false;
        },
        fetchCart(payload: { promo_code: null, gift_card: null }, options: { disableLoading: false }) {
            if (!options?.disableLoading) {
                this.$state.isLoading = true;
            }
            return useApi(`cart`, {
                method: "GET",
                params: payload
            },
                {
                    onSuccess: (data: any) => {
                        // Update cart state with data from API
                        this.$state.products = (data.data.products || []).map((item: any) => {
                            if (item.serial_number || item.voucher_group_name) {
                                item.type = 'gift_card';
                            } else {
                                item.type = 'service';
                            }
                            return item;
                        });

                        this.$state.loyalty_points = data.data.loyalty_points || {};
                        this.$state.payment_methods = data.data.payment_methods || [];
                        this.$state.working_times = data.data.working_times || [];
                        this.$state.title = data.data.cart_title || "";
                        this.$state.sub_title = data.data.cart_title_sub_message || "";
                        this.$state.message = data.data.message || "";
                        this.$state.cartServiceType = data.data.service_type || null;

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
        addOrUpdateServiceInCart(service: any, branchId = null, serviceType = null) {
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
        // Clear entire cart
        clearCart() {
            this.$state.isEmptying = true;
            return useApi(`cart/clear`, {
                method: "DELETE"
            },
                {
                    onSuccess: (data: any) => {
                        // Clear cart state
                        this.$state.products = [];
                        this.$state.subtotal = 0;
                        this.$state.vat = 0;
                        this.$state.discount = 0;
                        this.$state.service_cost = 0;
                        this.$state.total = 0;
                        this.$state.isEmptying = false;

                        console.log('Cart cleared successfully');
                    },
                    onError: (err: any) => {
                        this.$state.isEmptying = false;
                        console.error("Error clearing cart:", err);
                    }
                });
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
        },
        updateServiceAvailableSlot(payload: any, url = null) {
            this.$state.isAddLoading = true;
            const menu = useMenu();
            let endpoint = url ?? `cart-products/${menu?.service?.data?.cart_product_id || this.$state.products?.[0]?.cart_product_id}/update-time-slot`

            const appModule = useApp();

            return useApi(endpoint, {
                method: "POST",
                body: payload
            },
                {
                    onSuccess: (data: any) => {
                        this.$state.isAddLoading = false;
                        appModule.dialog.data.booking = data?.data;
                    },
                    onError: (err: any) => {
                        this.$state.isAddLoading = false;
                    }
                });
        },
        createOrder(payload: any = {}, onSuccess: Function = () => { }, onError: Function = () => { }) {
            this.$state.order.loading = true;

            const body: any = {
                payment_method_id: this.$state.payment_method_id,
                is_scheduled: 0,
                promo_code: this.$state.params?.promo_code ?? null,
                gift_card: this.$state.params?.gift_card ?? null,
                is_gifted_order: this.$state.params?.is_gifted_order ?? 0,
                gift_message: this.$state.params?.gift_message ?? '',
            }

            // ✅ Include gifted_order_data if it's a gifted order
            if (this.$state.params?.is_gifted_order === 1 && this.$state.params?.gifted_order_data) {
                body.gifted_order_data = {
                    first_name: this.$state.params.gifted_order_data.first_name,
                    last_name: this.$state.params.gifted_order_data.last_name,
                    mobile_code: this.$state.params.gifted_order_data.mobile_code,
                    mobile_number: this.$state.params.gifted_order_data.mobile_number,
                    email: this.$state.params.gifted_order_data.email
                }
            }

            return useApi(`orders`, {
                method: "POST",
                body: {
                    ...body,
                    ...payload
                }
            },
                {
                    onSuccess: (data: any) => {
                        this.$state.order.loading = false;
                        this.$state.order.data = data.data.order;
                        this.$state.payment = data.data.payment;
                        this.$state.confirmation_message = data.data.confirmation_message;
                        this.$state.saved_cards = data.data.saved_cards ?? [];
                        onSuccess(data);
                        this.openPaymentPopup();
                    },
                    onError: (err: any) => {
                        this.$state.order.loading = false;
                        console.error('Order creation failed:', err);
                        onError(err);
                    }
                });
        },


        openPaymentPopup(existingWin: Window | null = null) {
            const url = this.$state.payment?.create_token_url?.url;
            if (!url) {
                console.error('Payment URL not available');
                return;
            }

            // Reset attempts counter
            this.$state.paymentAttempts = 20;

            // Reuse pre-opened tab if provided, otherwise open a blank tab
            let win = existingWin && !existingWin.closed
                ? existingWin
                : window.open('about:blank', '_blank');

            if (!win) {
                console.error('Failed to open payment tab. Popup blocker?');
                return;
            }

            // Navigate the tab to the payment URL
            win.location.href = url;
            win.focus();

            // Save reference globally for later (close, polling, etc.)
            paymentWindow = win;

            // Start polling every 3s for payment status
            paymentInterval = setInterval(() => {
                this.checkPaymentStatus(paymentWindow);
            }, 3000);

            console.log('Payment tab opened, status polling started');
        },

        async checkPaymentStatus(paymentWin: Window | null) {
            const appModule = useApp();
            try {
                const { data } = await useApi(`payments/check-payment-status`, {
                    method: "POST",
                    body: {
                        merchant_reference: this.$state.order.data?.order_number,
                    }
                }, {
                    onSuccess: (data: any) => {
                        const payload = data.data;
                        console.log('onSuccess', payload);

                        try {
                            if (payload?.success === "pending" && this.$state.paymentAttempts > 0) {
                                this.$state.paymentAttempts--;
                            } else if (payload?.success === true) {

                                const toast = useToast();
                                toast.add({ title: this.$state.confirmation_message?.message_1, color: 'success' });

                                appModule.setDialogShow(false);

                                if (paymentInterval) {
                                    clearInterval(paymentInterval);
                                    paymentInterval = null;
                                }

                                if (paymentWin && !paymentWin.closed) {
                                    paymentWin.close();
                                    paymentWindow = null;
                                }
                                navigateTo("/dashboard/bookings");
                                this.$state.products = [];
                                this.fetchCart();
                            } else {
                                console.log('Payment failed or unknown status:', payload);
                                if (paymentInterval) {
                                    clearInterval(paymentInterval);
                                    paymentInterval = null;
                                }
                            }
                        } catch (e) {
                            console.warn("Cross-origin access blocked", e);
                            appModule.setDialogShow(false);
                            if (paymentInterval) {
                                clearInterval(paymentInterval);
                                paymentInterval = null;
                            }
                        }
                    }
                });

            } catch (err) {
                console.error("Error checking payment status:", err);
            }
        }
    },

    persist: {
        storage: localStorage,
        // Exclude loading states from persistence to prevent stuck loading spinners
        paths: ['products', 'loyalty_points', 'payment_methods', 'working_times', 'title', 'sub_title', 'message', 'subtotal', 'vat', 'discount', 'service_cost', 'total', 'payment_method_id', 'order.data', 'payment', 'confirmation_message', 'saved_cards', 'cartServiceType']
    },
});