import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface HealthyInfo {
    workout_id: number | null;
    body_mass_index_id: number | null;
    body_mass_index_value: number | null;
    ideal_wight: number | null;
    calories_per_day: number | null;
    measurement_data: any[];
    extra_data: any;
    tags: any[];
}

export interface Wallet {
    balance: number;
}

export interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
    email_verified_at: string | null;
    email_verified: number;
    gender: string;
    gender_label: string;
    date_of_birth: string | null;
    age: number | null;
    age_text: string | null;
    is_registered: boolean;
    is_completed: boolean;
    address: string | null;
    image_profile: string;
    number_of_points: number;
    qr_code_data: string;
    is_loyalty_blocked: boolean;
    created_at: string;
    customer_class: string | null;
    wallet: Wallet;
    healthy_ifo: HealthyInfo;
    favorites: any[];
    os_type: string | null;
}

export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    gender?: string;
    date_of_birth?: string;
    address?: string;
    email?: string;
    image_profile?: File | null;
}

export const useProfile = defineStore("profile", {
    state: () => {
        return {
            isLoading: false,
            isUpdating: false,
            profile: null as UserProfile | null,
            error: null as string | null,
            updateSuccess: false,
        }
    },

    getters: {
        getProfile(state): UserProfile | null {
            return state.profile;
        },

        getFullName(state): string {
            if (!state.profile) return '';
            return `${state.profile.first_name} ${state.profile.last_name}`.trim();
        },

        getWalletBalance(state): number {
            return state.profile?.wallet?.balance || 0;
        },

        getLoyaltyPoints(state): number {
            return state.profile?.number_of_points || 0;
        },

        isEmailVerified(state): boolean {
            return state.profile?.email_verified === 1;
        }
    },

    actions: {
        fetchProfile() {
            this.$state.isLoading = true;
            this.$state.error = null;

            return useApi('account/info', {
                method: 'GET'
            }, {
                onSuccess: (data: any) => {
                    if (data.status && data?.data) {
                        this.$state.profile = data.data;
                        this.$state.error = null;
                    } else {
                        console.error('Invalid profile response format:', data);
                        this.$state.error = 'Invalid response format from server';
                    }
                    this.$state.isLoading = false;
                },
                onError: (error: any) => {
                    console.error('Error fetching profile:', error);
                    this.$state.error = error?.message || 'Failed to load profile';
                    this.$state.isLoading = false;
                }
            });
        },

        updateProfile(profileData: ProfileUpdateData) {
            this.$state.isUpdating = true;
            this.$state.error = null;
            this.$state.updateSuccess = false;

            // SIMPLE UNIFIED APPROACH: Always FormData + POST with _method override
            const formData = new FormData();

            // Add all fields to FormData (handles both text and files)
            Object.keys(profileData).forEach(key => {
                const value = profileData[key as keyof ProfileUpdateData];
                if (value !== undefined && value !== null) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            // Add Laravel method override for FormData
            formData.append('_method', 'PUT');



            return useApi('account/update', {
                method: 'POST', // Use POST with _method override for Laravel FormData compatibility
                body: formData // Always use FormData
                // Don't pass any headers - let useApi handle everything including Authorization
            }, {
                onSuccess: (data: any) => {
                    if (data.status && data?.data) {
                        // Update the profile with new data
                        this.$state.profile = { ...this.$state.profile, ...data.data };
                        this.$state.updateSuccess = true;
                        this.$state.error = null;

                        // Show success message
                        const toast = useToast();
                        toast.add({
                            title: data.message || 'Profile updated successfully',
                            color: 'success'
                        });
                    } else {
                        console.error('Invalid update response format:', data);
                        this.$state.error = 'Invalid response format from server';
                    }
                    this.$state.isUpdating = false;
                },
                onError: (error: any) => {
                    console.error('Error updating profile:', error);
                    this.$state.error = error?.message || 'Failed to update profile';
                    this.$state.isUpdating = false;

                    // Show error message
                    const toast = useToast();
                    toast.add({
                        title: this.$state.error,
                        color: 'error'
                    });
                }
            });
        },

        clearError() {
            this.$state.error = null;
            this.$state.updateSuccess = false;
        },

        clearProfile() {
            this.$state.profile = null;
            this.$state.error = null;
            this.$state.updateSuccess = false;
        }
    },

    persist: {
        storage: localStorage,
        paths: ['profile']
    }
});
