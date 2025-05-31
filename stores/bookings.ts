import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface OrderStatus {
    color: string;
    labels: {
        en: string;
        ar: string;
    };
    display_in_order_history_app: string;
    display_active_in_order_history_app: string;
    label: string;
    image: string | null;
    value: number;
    order: number | null;
}

export interface PaymentMethod {
    id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
    code: string;
    is_active: boolean;
}

export interface PaymentStatus {
    label: string;
    value: string;
    class: string;
}

export interface PaymentType {
    value: string;
    label: string;
    class: string;
}

export interface Branch {
    name: string;
    lat: number;
    long: number;
}

export interface TypeText {
    class: string;
    label: string;
    value: string;
}

export interface Order {
    id: number;
    type: string;
    type_text: TypeText;
    order_number: string;
    extra_data: any[];
    source_id: string;
    menu_id: number | null;
    delivery_method: string;
    branch_name: string;
    address: string | null;
    is_delivery: boolean;
    tracking_url: string | null;
    status: OrderStatus;
    status_text: string;
    status_text_control_panel: string;
    delivery_date: string | null;
    delivery_time: string | null;
    date: string;
    time: string;
    total: number;
    cashback_amount: number;
    cash_back_balance: number;
    driver: any[];
    invoice_link: string;
    invoice_pdf: string;
    can_rate: boolean;
    can_reorder: boolean;
    can_track: boolean;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    total_payments: string;
    total_refunds: number;
    remaining_price: number;
    is_cancelable: boolean;
    is_rate_redirected: boolean;
    branch: Branch;
    rate_redirect_url: string | null;
    skip_rating: boolean;
    added_by: string;
    extra_notes: string | null;
    promo_discount: number;
    redeem_points: number;
    gift_card_discount: number;
    gift_card_remaining_discount: number;
    redeem_points_price: number;
    order_service_fee_price: number;
    brand_id: number | null;
    brand: any;
    user_car_id: number | null;
    tip_amount: number;
    payment_type: PaymentType;
    split_payment_option: any;
    number_of_users: number;
    number_of_paid_users: number;
    remaining_number_of_users: number;
    mobile_number: string | null;
    portion_amount: number | null;
    refunded_amount: number;
}

export interface PaginationOptions {
    current_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page: boolean;
    last_page: number;
    count: number;
    per_page: number;
    total: number;
}

export interface BookingsResponse {
    orders: Order[];
    pagination_options: PaginationOptions;
}

export const useBookings = defineStore("bookings", {
    state: () => {
        return {
            isLoading: false,
            orders: [] as Order[],
            pagination: null as PaginationOptions | null,
            error: null as string | null,
            currentPage: 1,
            selectedOrder: null as Order | null,
        }
    },

    getters: {
        getOrders(state): Order[] {
            return state.orders;
        },

        getOrderById: (state) => (id: number): Order | undefined => {
            return state.orders.find(order => order.id === id);
        },

        getPagination(state): PaginationOptions | null {
            return state.pagination;
        },

        hasNextPage(state): boolean {
            return state.pagination?.next_page_url !== null;
        },

        hasPrevPage(state): boolean {
            return state.pagination?.prev_page_url !== null;
        },

        getTotalOrders(state): number {
            return state.pagination?.total || 0;
        },

        getActiveOrders(state): Order[] {
            return state.orders.filter(order =>
                order.status.display_active_in_order_history_app === "1"
            );
        },

        getCompletedOrders(state): Order[] {
            return state.orders.filter(order =>
                order.status.display_active_in_order_history_app === "0"
            );
        }
    },

    actions: {
        fetchOrders(page: number = 1) {
            this.$state.isLoading = true;
            this.$state.error = null;
            this.$state.currentPage = page;

            return useApi(`orders?page=${page}`, {
                method: 'GET'
            }, {
                onSuccess: (data: any) => {
                    if (data.status && data?.data) {
                        this.$state.orders = data.data.orders;
                        this.$state.pagination = data.data.pagination_options;
                        this.$state.error = null;
                    } else {
                        console.error('Invalid bookings response format:', data);
                        this.$state.error = 'Invalid response format from server';
                    }
                    this.$state.isLoading = false;
                },
                onError: (error: any) => {
                    console.error('Error fetching bookings:', error);
                    this.$state.error = error?.message || 'Failed to load bookings';
                    this.$state.isLoading = false;
                }
            });
        },

        loadNextPage() {
            if (this.hasNextPage) {
                this.fetchOrders(this.currentPage + 1);
            }
        },

        loadPrevPage() {
            if (this.hasPrevPage && this.currentPage > 1) {
                this.fetchOrders(this.currentPage - 1);
            }
        },

        refreshOrders() {
            this.fetchOrders(this.currentPage);
        },

        selectOrder(order: Order) {
            this.$state.selectedOrder = order;
        },

        clearSelectedOrder() {
            this.$state.selectedOrder = null;
        },

        clearError() {
            this.$state.error = null;
        },

        clearOrders() {
            this.$state.orders = [];
            this.$state.pagination = null;
            this.$state.error = null;
            this.$state.selectedOrder = null;
        },

        // Cancel order
        async cancelOrder(orderId: number) {
            this.$state.isLoading = true;
            this.$state.error = null;

            try {
                const response = await useApi(`orders/${orderId}/cancel`, {
                    method: 'GET'
                });

                if (response.status) {
                    // Show success message
                    const toast = useToast();
                    toast.add({
                        title: response.message || 'Order cancelled successfully',
                        color: 'success'
                    });

                    // Refresh the orders data to get the updated status from server
                    await this.fetchOrders(this.currentPage);

                    return { success: true, data: response.data };
                } else {
                    throw new Error(response.message || 'Failed to cancel order');
                }
            } catch (error: any) {
                console.error('Error cancelling order:', error);
                this.$state.error = error?.message || 'Failed to cancel order';

                // Show error message
                const toast = useToast();
                toast.add({
                    title: this.$state.error,
                    color: 'error'
                });

                return { success: false, error: this.$state.error };
            } finally {
                this.$state.isLoading = false;
            }
        }
    },

    persist: {
        storage: localStorage,
        paths: ['orders', 'pagination', 'currentPage']
    }
});
