import { defineStore } from "pinia";
import { useMenu } from "./menu";
import { useApi } from "../composables/useApi";

// NOTE: Some composables (useApp, useToast, navigateTo) are auto-imported by Nuxt in this project.
// If your setup does not auto-import them, import explicitly.

let paymentWindow: Window | null = null;
let paymentInterval: any = null;

export const useCart = defineStore("cart", {
    state: () => {
        return {
            // General flags
            isGiftCardApplyLoading: false,
            isPromoApplyLoading: false,

            // Cart query params persisted and reused across requests
            params: {
                promo_code: null as string | null,
                gift_card: null as string | null,
                is_gifted_order: 0 as 0 | 1,
                gifted_order_data: {
                    first_name: "",
                    last_name: "",
                    mobile_code: "966",
                    mobile_number: "",
                    email: ""
                },
                gift_message: "",
                // ✅ Persistable service fees (source of truth)
                service_fees: [] as Array<{ id: number; address_id?: number | null }>
            },

            // Loading flags
            isAddLoading: false,
            isLoading: false,
            isRemoving: false,
            isEmptying: false,

            // Core cart data
            products: [] as any[],
            loyalty_points: {} as any,
            payment_methods: [] as any[],
            working_times: [] as any[],
            title: "",
            sub_title: "",
            message: "",
            subtotal: 0,
            vat: 0,
            discount: 0,
            service_cost: 0,
            total: 0,
            payment_method_id: null as number | null,

            // Order + payment
            order: {
                loading: true,
                data: {} as any
            },
            payment: {} as any,
            confirmation_message: {} as any,
            saved_cards: [] as any[],

            // Polling/payment helpers
            paymentAttempts: 20,
            paymentWindow: null as any,
            paymentInterval: null as any,

            // Domain-specific
            cartServiceType: null as any,

            // ---------- VIP service fees state ----------
            selectedServiceFeeId: null as number | null,
            selectedServiceFeeAddressId: null as number | null,
            available_service_fees: [] as any[]
        };
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
        },
           getServiceType(state) {
            return state.cartServiceType;
        }
    },

    actions: {
        // ---------- helpers (private) ----------
        /** Build bracketed params for service_fees from persisted params.service_fees */
        _serviceFeesAsParams(): Record<string, any> {
            const params: Record<string, any> = {};
            const list = this.$state.params?.service_fees ?? [];
            list.forEach((fee, idx) => {
                if (fee?.id != null) params[`service_fees[${idx}][id]`] = fee.id;
                if (fee?.address_id != null)
                    params[`service_fees[${idx}][address_id]`] = fee.address_id;
            });
            return params;
        },

        /** Clear VIP selection state (both persisted and quick fields) */
        resetVipState() {
            this.$state.params.service_fees = [];
            this.$state.selectedServiceFeeId = null;
            this.$state.selectedServiceFeeAddressId = null;
        },

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

        // -------- fetchCart (UPDATED) --------
        // Make payload generic so we can pass bracketed keys (service_fees[0][id], etc.)
        fetchCart(
            payload: Record<string, any> = {},
            options: { disableLoading?: boolean } = { disableLoading: false }
        ) {
            if (!options?.disableLoading) {
                this.$state.isLoading = true;
            }

            // ✅ Always include bracketed service_fees derived from persisted params
            const finalParams = {
                ...payload,
                ...this._serviceFeesAsParams()
            };

            return useApi(
                `cart`,
                {
                    method: "GET",
                    params: finalParams
                },
                {
                    onSuccess: (data: any) => {

                        // --- helper: sum service fees from products (fallback when root doesn't provide a total) ---
const sumServiceFeesFromProducts = (root: any) => {
  const items = Array.isArray(root?.products) ? root.products : []
  let sum = 0
  for (const p of items) {
    const fees = Array.isArray(p?.service_fees) ? p.service_fees : []
    for (const f of fees) {
      // Prefer backend-computed total if present; fallback to value
      const v = f?.total_fees ?? f?.total ?? f?.value ?? 0
      sum += Number(v)
    }
  }
  return sum
}

                        // Normalize root
                        const root = data?.data ?? data ?? {};

                        // Update cart state with data from API
                        this.$state.products = (root.products || []).map((item: any) => {
                            if (item.serial_number || item.voucher_group_name) {
                                item.type = "gift_card";
                            } else {
                                item.type = "service";
                            }
                            return item;
                        });

                        this.$state.loyalty_points = root.loyalty_points || {};
                        this.$state.payment_methods = root.payment_methods || [];
                        this.$state.working_times = root.working_times || [];
                        this.$state.title = root.cart_title || "";
                        this.$state.sub_title = root.cart_title_sub_message || "";
                        this.$state.message = root.message || "";
                        this.$state.cartServiceType = root.service_type || null;

                        // Pricing
                        this.$state.subtotal = root.sub_total || 0;
                        this.$state.vat = root.tax_amount || 0;
                        this.$state.discount =
                            (root.promo_discount || 0) +
                            (root.extra_discount || 0) +
                            (root.gift_card_discount || 0);
                        const rootFees = Number(root?.order_service_fees_price ?? 0)
                        const productFees = sumServiceFeesFromProducts(root)
                        this.$state.service_cost = rootFees > 0 ? rootFees : productFees
                        this.$state.total = root.total || 0;

                        // -------- Capture available service fees for VIP UI --------
                        const fees =
                            root.available_service_fees ||
                            data?.available_service_fees ||
                            data?.cart?.available_service_fees ||
                            [];
                        this.$state.available_service_fees = Array.isArray(fees) ? fees : [];

                        // Optional echo from backend
                        if (root.selected_service_fee_id != null) {
                            this.$state.selectedServiceFeeId = root.selected_service_fee_id;
                        }
                        if (root.selected_service_fee_address_id != null) {
                            this.$state.selectedServiceFeeAddressId =
                                root.selected_service_fee_address_id;
                        }

                        // If backend returns selected fees as array, sync persisted params
                        if (
                            Array.isArray(root?.selected_service_fees) &&
                            root.selected_service_fees.length
                        ) {
                            // Expect shape like [{ id, address_id }]
                            this.$state.params.service_fees = root.selected_service_fees.map(
                                (f: any) => ({
                                    id: Number(f.id),
                                    address_id:
                                        f.address_id != null ? Number(f.address_id) : null
                                })
                            );
                            // Reflect to quick fields (first element)
                            const first = this.$state.params.service_fees[0];
                            this.$state.selectedServiceFeeId = first?.id ?? null;
                            this.$state.selectedServiceFeeAddressId =
                                first?.address_id ?? null;
                        } else if (!this.$state.params.service_fees?.length) {
                            // If nothing in params but quick fields exist (persisted), rebuild params from them
                            if (this.$state.selectedServiceFeeId) {
                                this.$state.params.service_fees = [
                                    {
                                        id: this.$state.selectedServiceFeeId,
                                        address_id: this.$state.selectedServiceFeeAddressId ?? null
                                    }
                                ];
                            }
                        }

                        // ✅ If cart has no products or no available fees, clear VIP state
                        const noItems = (this.$state.products?.length ?? 0) === 0;
                        const noFees = (this.$state.available_service_fees?.length ?? 0) === 0;

                        if (noItems || noFees) {
                            this.resetVipState();
                            this.resetGiftState(); // <-- add this
                        }


                        this.$state.isLoading = false;


                        // --- Keep quick fields in sync with persisted params.service_fees (important after back nav) ---
                        if (Array.isArray(this.$state.params?.service_fees) && this.$state.params.service_fees.length) {
                            const f = this.$state.params.service_fees[0]
                            // If quick fields missing or stale, hydrate them from persisted params
                            if (this.$state.selectedServiceFeeId !== f.id ||
                                this.$state.selectedServiceFeeAddressId !== (f.address_id ?? null)) {
                                this.$state.selectedServiceFeeId = f.id
                                this.$state.selectedServiceFeeAddressId = f.address_id ?? null
                            }
                        } else {
                            // If nothing persisted AND backend didn't echo anything, clear quick fields
                            if (!root?.selected_service_fee_id && !root?.selected_service_fees) {
                                this.$state.selectedServiceFeeId = null
                                this.$state.selectedServiceFeeAddressId = null
                            }
                        }

                    },
                    onError: (err: any) => {
                        this.$state.isLoading = false;
                        console.error("Error fetching cart:", err);
                    }
                }
            );
        },

        emptyCart() {
            this.$state.isEmptying = true;
            return useApi(
                `delete-all-cart`,
                {
                    method: "DELETE"
                },
                {
                    onSuccess: () => {
                        // Clear cart data
                        this.$state.products = [];
                        this.$state.subtotal = 0;
                        this.$state.vat = 0;
                        this.$state.discount = 0;
                        this.$state.service_cost = 0;
                        this.$state.total = 0;
                        this.$state.isEmptying = false;

                        // ✅ Also clear VIP selection
                        this.resetVipState();
                        this.resetGiftState();

                        // Refresh cart data to ensure UI is in sync with server
                        this.fetchCart();
                    },
                    onError: (err: any) => {
                        this.$state.isEmptying = false;
                        console.error("Error emptying cart:", err);
                    }
                }
            );
        },

        addOrUpdateServiceInCart(service: any, branchId = null, serviceType = null) {
            const menuModule = useMenu();
            this.$state.isAddLoading = true;

            // Determine if this is an update operation
            const isUpdate =
                service.cart_product_id && service.cart_product_id !== undefined;

            if (isUpdate) {
                // Update existing cart item
                const updateRequestBody: any = {
                    product_id: service.id,
                    quantity: 1,
                    branch_id: branchId ?? service.branch_id ?? menuModule.branch_id,
                    cart_product_id: service.cart_product_id
                };

                if (service.selectedExtension) {
                    updateRequestBody.selectedExtension = service.selectedExtension;
                }
                if (service.selectedTime) {
                    updateRequestBody.selectedTime = service.selectedTime;
                }
                if (service.date) {
                    updateRequestBody.date = service.date;
                }

                return useApi(
                    `cart`,
                    {
                        method: "POST",
                        body: updateRequestBody
                    },
                    {
                        onSuccess: (data: any) => {
                            if (data.data) {
                                this.$state.products = data.data.products || this.$state.products;
                                this.$state.subtotal = data.data.subtotal || this.$state.subtotal;
                                this.$state.vat = data.data.vat || this.$state.vat;
                                this.$state.total = data.data.total || this.$state.total;
                            }
                            this.$state.isAddLoading = false;
                            this.fetchCart();
                        },
                        onError: (err: any) => {
                            this.$state.isAddLoading = false;
                            console.error("Error updating cart:", err);
                        }
                    }
                );
            } else {
                // Add new item
                const addRequestBody: any = {
                    product_id: service.id,
                    quantity: 1,
                    branch_id: branchId ?? service.branch_id ?? menuModule.branch_id
                };

                if (service.selectedExtension) {
                    addRequestBody.selectedExtension = service.selectedExtension;
                }
                if (service.selectedTime) {
                    addRequestBody.selectedTime = service.selectedTime;
                }
                if (service.date) {
                    addRequestBody.date = service.date;
                }

                return useApi(
                    `cart`,
                    {
                        method: "POST",
                        body: addRequestBody
                    },
                    {
                        onSuccess: (data: any) => {
                            if (data.data) {
                                this.$state.products = data.data.products || this.$state.products;
                                this.$state.subtotal = data.data.subtotal || this.$state.subtotal;
                                this.$state.vat = data.data.vat || this.$state.vat;
                                this.$state.total = data.data.total || this.$state.total;
                            }
                            this.$state.isAddLoading = false;
                            this.fetchCart();
                        },
                        onError: (err: any) => {
                            this.$state.isAddLoading = false;
                            console.error("Error adding to cart:", err);
                        }
                    }
                );
            }
        },

        // Clear entire cart
        clearCart() {
            this.$state.isEmptying = true;
            return useApi(
                `cart/clear`,
                {
                    method: "DELETE"
                },
                {
                    onSuccess: () => {
                        // Clear cart state
                        this.$state.products = [];
                        this.$state.subtotal = 0;
                        this.$state.vat = 0;
                        this.$state.discount = 0;
                        this.$state.service_cost = 0;
                        this.$state.total = 0;
                        this.$state.isEmptying = false;

                        // ✅ Also clear VIP selection
                        this.resetVipState();
                        this.resetGiftState();

                    },
                    onError: (err: any) => {
                        this.$state.isEmptying = false;
                        console.error("Error clearing cart:", err);
                    }
                }
            );
        },

        removeProduct(cartProductId: number | string) {
            this.$state.isRemoving = true;
            return useApi(
                `cart/${cartProductId}`,
                {
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

                        // ✅ If cart is empty now, clear VIP selection
                        if ((this.$state.products?.length ?? 0) === 0) {
                            this.resetVipState();
                            this.resetGiftState();
                        }

                        this.fetchCart();
                    },
                    onError: (err: any) => {
                        this.$state.isRemoving = false;
                        console.error("Error removing product:", err);
                    }
                }
            );
        },

        updateServiceAvailableSlot(payload: any, url = null) {
            this.$state.isAddLoading = true;
            const menu = useMenu();
            const endpoint =
                url ??
                `cart-products/${(menu as any)?.service?.data?.cart_product_id ||
                this.$state.products?.[0]?.cart_product_id
                }/update-time-slot`;

            const appModule = useApp();

            return useApi(
                endpoint,
                {
                    method: "POST",
                    body: payload
                },
                {
                    onSuccess: async (data: any) => {
                        this.$state.isAddLoading = false;
                        (appModule as any).dialog.data.booking = data?.data;

                        await this.fetchCart({}, { disableLoading: true });

                    },
                    onError: () => {
                        this.$state.isAddLoading = false;
                    }
                }
            );
        },

        // -------- VIP: apply/clear --------
        async applyServiceFee(id: number, addressId?: number) {
            // Update persisted params
            this.$state.params.service_fees = [
                { id, address_id: addressId ?? null }
            ];
            // Quick reference for UI
            this.$state.selectedServiceFeeId = id;
            this.$state.selectedServiceFeeAddressId = addressId ?? null;

            // Refresh cart quietly so summary updates without big spinner
            await this.fetchCart({}, { disableLoading: true });
        },

        async clearServiceFee() {
            // Clear persisted params
            this.$state.params.service_fees = [];
            // Clear quick refs
            this.$state.selectedServiceFeeId = null;
            this.$state.selectedServiceFeeAddressId = null;

            await this.fetchCart({}, { disableLoading: true });
        },

        // -------- Order --------
        // -------- Order --------
       createOrder(
  payload: any = {},
  onSuccess: Function = () => {},
  onError: Function = () => {}
) {
  this.$state.order.loading = true;

  // Normalize once
  const msg = (this.$state.params?.gift_message ?? '').trim();

  // Build base body (top-level message)
  const body: any = {
    payment_method_id: this.$state.payment_method_id,
    is_scheduled: 0,
    promo_code: this.$state.params?.promo_code ?? null,
    gift_card: this.$state.params?.gift_card ?? null,
    is_gifted_order: this.$state.params?.is_gifted_order ?? 0,
    gift_message: msg
  };

  // If gifted order, also mirror message inside gifted_order_data (legacy contract)
  if (
    this.$state.params?.is_gifted_order === 1 &&
    this.$state.params?.gifted_order_data
  ) {
    body.gifted_order_data = {
      first_name: this.$state.params.gifted_order_data.first_name,
      last_name: this.$state.params.gifted_order_data.last_name,
      mobile_code: this.$state.params.gifted_order_data.mobile_code,
      mobile_number: this.$state.params.gifted_order_data.mobile_number,
      email: this.$state.params.gifted_order_data.email,
      message: msg
    };
  }

  // ✅ هنا المهم: أرسل service_fees كمصفوفة JSON إذا فيه اختيار
  if (Array.isArray(this.$state.params?.service_fees) && this.$state.params.service_fees.length) {
    body.service_fees = this.$state.params.service_fees.map(f => ({
      id: Number(f.id),
      ...(f.address_id != null ? { address_id: Number(f.address_id) } : {})
    }));
  }

  // Protect against accidental overwrite from external payload
  const safePayload = { ...payload };
  if ('gift_message' in safePayload && (safePayload.gift_message == null)) {
    delete safePayload.gift_message;
  }

  // 👇 لاحظ: ما عاد نستخدم serviceFeesParams هنا (المُقوّسة)
  // console.debug('[DEBUG] createOrder body:', { ...body, ...safePayload });

  return useApi(
    `orders`,
    {
      method: 'POST',
      body: {
        ...body,
        ...safePayload
      }
    },
    {
      onSuccess: (data: any) => {
        this.$state.order.loading = false;
        this.$state.order.data = data.data.order;
        this.$state.payment = data.data.payment;
        this.$state.confirmation_message = data.data.confirmation_message;
        this.$state.saved_cards = data.data.saved_cards ?? [];

        this.resetVipState();
        this.resetGiftState();

        onSuccess(data);
      },
      onError: (err: any) => {
        this.$state.order.loading = false;
        console.error('Order creation failed:', err);
        onError(err);
      }
    }
  );
}

        ,

        openPaymentPopup(existingWin: Window | null = null) {
            const url = this.$state.payment?.create_token_url?.url;
            if (!url) {
                console.error("Payment URL not available");
                return;
            }

            // Reset attempts counter
            this.$state.paymentAttempts = 20;

            // Reuse pre-opened tab if provided, otherwise open a blank tab
            let win =
                existingWin && !existingWin.closed
                    ? existingWin
                    : window.open("about:blank", "_blank");

            if (!win) {
                console.error("Failed to open payment tab. Popup blocker?");
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

            console.log("Payment tab opened, status polling started");
        },

        async checkPaymentStatus(paymentWin: Window | null) {
            const appModule = useApp();
            try {
                await useApi(
                    `payments/check-payment-status`,
                    {
                        method: "POST",
                        body: {
                            merchant_reference: this.$state.order.data?.order_number
                        }
                    },
                    {
                        onSuccess: (data: any) => {
                            const payload = data.data;

                            try {
                                if (
                                    payload?.success === "pending" &&
                                    this.$state.paymentAttempts > 0
                                ) {
                                    this.$state.paymentAttempts--;
                                } else if (payload?.success === true) {
                                    const toast = useToast();
                                    toast.add({
                                        title: this.$state.confirmation_message?.message_1,
                                        color: "success"
                                    });

                                    (appModule as any).setDialogShow(false);

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
                                    // Failed or unknown status
                                    if (paymentInterval) {
                                        clearInterval(paymentInterval);
                                        paymentInterval = null;
                                    }
                                }
                            } catch (e) {
                                console.warn("Cross-origin access blocked", e);
                                (appModule as any).setDialogShow(false);
                                if (paymentInterval) {
                                    clearInterval(paymentInterval);
                                    paymentInterval = null;
                                }
                            }
                        }
                    }
                );
            } catch (err) {
                console.error("Error checking payment status:", err);
            }
        },
        /** Clear gifted-order state (switch off + empty data) */
        /** Clear gifted-order state (switch off + empty data) */
        resetGiftState() {
            // Turn off the gift switch
            this.$state.params.is_gifted_order = 0;

            // Empty gifted order recipient info
            this.$state.params.gifted_order_data = {
                first_name: "",
                last_name: "",
                mobile_code: "966",
                mobile_number: "",
                email: ""
            };

            // Empty the gift message
            this.$state.params.gift_message = "";

            // (Optional) Notify UI listeners, if any
            try {
                window.dispatchEvent(new CustomEvent('giftNotConfirmed'));
                window.dispatchEvent(new CustomEvent('giftCleared'));
            } catch { }
        }


    },

    persist: {
        storage: localStorage,
        // Exclude loading states from persistence to prevent stuck loading spinners
        paths: [
            "products",
            "loyalty_points",
            "payment_methods",
            "working_times",
            "title",
            "sub_title",
            "message",
            "subtotal",
            "vat",
            "discount",
            "service_cost",
            "total",
            "payment_method_id",
            "order.data",
            "payment",
            "confirmation_message",
            "saved_cards",
            "cartServiceType",
            // VIP persistence
            "params.service_fees",
            "selectedServiceFeeId",
            "selectedServiceFeeAddressId",
            "available_service_fees",
            'params.gift_message',
            'params.is_gifted_order',
            'params.gifted_order_data',
        ]
    }
});
