import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface WorkingTime {
    day: string;
    day_index: string;
    start_at: string;
    end_at: string;
    is_active1: boolean;
    start2_at: string;
    end2_at: string;
    is_active2: boolean;
    is_active: boolean;
    time_shifts: Array<{
        start_at: string;
        end_at: string;
        is_active: boolean;
    }>;
    text: string;
}

export interface Branch {
    id: number;
    name: string;
    image: string;
    contact_name: string | null;
    email: string | null;
    phone: string | null;
    latitude: string | null;
    longitude: string | null;
    description: string;
    country: string | null;
    city_name: string;
    address: string;
    is_open: boolean;
    distance: number | null;
    common_day: string;
    common_time: string;
    working_times: WorkingTime[];
    thumpimage_image: string;
    main_image: string;
    booking_url: string | null;
    external_link_label: string;
    external_link_details: string;
    common_time_from: string;
    common_time_to: string;
    google_map_link: string;
}

export const useBranches = defineStore("branches", {
    state: () => {
        return {
            isLoading: false,
            branches: [] as Branch[],
            error: null as string | null,
            selectedCity: '' as string,
        }
    },

    getters: {
        getBranches(state): Branch[] {
            return state.branches;
        },

        getBranchesByCity(state) {
            return (city: string) => {
                if (!city) return state.branches;
                return state.branches.filter(branch =>
                    branch.city_name.toLowerCase().includes(city.toLowerCase())
                );
            };
        },

        getAvailableCities(state): string[] {
            const cities = state.branches
                .map(branch => branch.city_name)
                .filter(city => city && city.trim() !== '');
            return [...new Set(cities)];
        },

        getOpenBranches(state): Branch[] {
            return state.branches.filter(branch => branch.is_open);
        }
    },

    actions: {
        fetchBranches() {
            this.$state.isLoading = true;
            this.$state.error = null;

            return useApi('branches', {
                method: 'GET'
            }, {
                onSuccess: (data: any) => {
                    if (data?.data && Array.isArray(data.data)) {
                        this.$state.branches = data.data;
                        this.$state.error = null;
                    } else {
                        console.error('Invalid response format. Expected data.data array, got:', data);
                        this.$state.error = 'Invalid response format from server';
                    }
                    this.$state.isLoading = false;
                },
                onError: (error: any) => {
                    console.error('Error fetching branches:', error);
                    this.$state.error = error?.message || error?.toString() || 'Failed to load branches';
                    this.$state.isLoading = false;
                }
            });
        },

        getBranchById(id: number): Branch | undefined {
            return this.$state.branches.find(branch => branch.id === id);
        },

        setSelectedCity(city: string) {
            this.$state.selectedCity = city;
        },

        clearError() {
            this.$state.error = null;
        }
    },

    persist: true
});
