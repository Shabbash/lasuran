import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface Slider {
    id: number;
    name: string;
    description: string;
    clickable: boolean;
    url: string | null;
    image: string;
}

export interface DeliveryMethod {
    id: number;
    name: string;
    description: string;
    code: string;
    image: string;
    is_enabled: boolean;
}

export interface HomeData {
    survey: any;
    sliders: Slider[];
    delivery_methods: DeliveryMethod[];
    un_read_notifications: number;
    user_healthy_info: any;
    plan_subscriptions: any[];
    disabled_delivery_method_msg: string;
}

export interface TemplateSection {
    id: number;
    title: string;
    description: string;
    type: string;
    to: string;
    display_type: string;
    is_url: boolean;
    url: string;
    items_per_slide: number;
    items_per_row: number;
    background_color: string | null;
    text_color: string | null;
    section_height: string | null;
    auth_type: string;
    items: TemplateItem[];
}

export interface TemplateItem {
    id: number;
    price: number;
    title: string;
    image_url: string | null;
    sub_title: string;
    to: string;
}

export interface SettingsData {
    template_settings: {
        home: TemplateSection[];
    };
}

export const useHome = defineStore("home", {
    state: () => {
        return {
            isLoading: false,
            error: null as string | null,
            homeData: null as HomeData | null,
            settingsData: null as SettingsData | null,
        }
    },

    getters: {
        // Home data getters
        sliders(state): Slider[] {
            return state.homeData?.data?.sliders || [];
        },
        
        deliveryMethods(state): DeliveryMethod[] {
            return state.homeData?.delivery_methods || [];
        },
        
        enabledDeliveryMethods(state): DeliveryMethod[] {
            return state.homeData?.delivery_methods?.filter(method => method.is_enabled) || [];
        },
        
        unreadNotifications(state): number {
            return state.homeData?.un_read_notifications || 0;
        },
        
        // Template sections getters
        homeSections(state): TemplateSection[] {
            return state.settingsData?.template_settings?.home || [];
        },
        
        // Get sections by type
        sliderSections(state): TemplateSection[] {
            return state.settingsData?.template_settings?.home?.filter(section => section.type === 'slider') || [];
        },
        
        // Transform sliders for UI compatibility
        transformedSliders(state): any[] {
            return state.homeData?.sliders?.map(slider => ({
                id: slider.id,
                title: slider.name,
                image_url: slider.image,
                sub_title: slider.description,
                clickable: slider.clickable,
                url: slider.url,
                to: slider.clickable && slider.url ? 'url' : 'image'
            })) || [];
        },
        
        // Transform template items for UI compatibility
        getTransformedItems: (state) => (sectionId: number) => {
            const section = state.settingsData?.template_settings?.home?.find(s => s.id === sectionId);
            return section?.items?.map(item => ({
                id: item.id,
                title: item.title,
                image_url: item.image_url || '/assets/img/default-service.png',
                sub_title: `${item.price} SAR`,
                price: item.price,
                branch: item.sub_title,
                clickable: true,
                url: null,
                to: item.to || 'food'
            })) || [];
        }
    },

    actions: {
        async fetchHomeData() {
            this.$state.isLoading = true;
            this.$state.error = null;

            try {
                const response = await useApi('home', {
                    method: 'GET'
                });

                if (response.status) {
                    console.log('home: ',response.data);
                    this.$state.homeData = response.data;
                    console.log('state.homeData: ',this.$state.homeData);
                    return { success: true, data: response.data };
                } else {
                    throw new Error(response.message || 'Failed to fetch home data');
                }
            } catch (error: any) {
                console.error('Error fetching home data:', error);
                this.$state.error = error?.message || 'Failed to fetch home data';
                return { success: false, error: this.$state.error };
            } finally {
                this.$state.isLoading = false;
            }
        },

        async fetchSettingsData() {
            try {
                const response = await useApi('settings', {
                    method: 'GET'
                });

                if (response.status) {
                    this.$state.settingsData = response.data;
                    return { success: true, data: response.data };
                } else {
                    throw new Error(response.message || 'Failed to fetch settings data');
                }
            } catch (error: any) {
                console.error('Error fetching settings data:', error);
                this.$state.error = error?.message || 'Failed to fetch settings data';
                return { success: false, error: this.$state.error };
            }
        },

        async initializeHome() {
            this.$state.isLoading = true;
            
            try {
                // Fetch both home and settings data
                const [homeResult, settingsResult] = await Promise.all([
                    this.fetchHomeData(),
                    this.fetchSettingsData()
                ]);

                if (homeResult.success && settingsResult.success) {
                    return { success: true };
                } else {
                    throw new Error('Failed to initialize home data');
                }
            } catch (error: any) {
                console.error('Error initializing home:', error);
                this.$state.error = error?.message || 'Failed to initialize home';
                return { success: false, error: this.$state.error };
            } finally {
                this.$state.isLoading = false;
            }
        },

        clearError() {
            this.$state.error = null;
        },

        clearData() {
            this.$state.homeData = null;
            this.$state.settingsData = null;
            this.$state.error = null;
        }
    },

    persist: {
        storage: localStorage,
        paths: ['homeData', 'settingsData']
    }
});
