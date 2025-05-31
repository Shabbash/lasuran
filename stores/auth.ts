import { defineStore } from "pinia";
import type { AuthState } from '~/types/auth';
import { COMPONENTS } from "~/data/constants";
import components from "~/components/import";

export const useAuth = defineStore("auth", {
    state: (): AuthState => {
        return {
            loading: false,
            user: {},
            token: '',
            step: COMPONENTS.SEND_OTP_STEP,
            mobile_number: '',
            mobile_code: "966",
            otp: null
        }
    },
    getters: {
        isAuthenticated(state: AuthState) {
            return !!state.token;
        },
        getUser(state: AuthState) {
            return state.user;
        },
        getToken(state: AuthState) {
            return state.token;
        },
        getStepComponent(state: AuthState) {
            return components[state.step];
        },
        getUserName(state: AuthState) {
            return `${this.getUser?.first_name} ${this.getUser?.last_name}` ?? '-'
        },
        getMobileNumber(state: AuthState) {
            return`+${this.getUser?.mobile_number}` ?? '-'
        },
        getFullOtpMobileNumber(state: AuthState) {
            return `+${state.mobile_code} ${state.mobile_number}`;
        },
        isAdmin(state: AuthState) {
            const role = state.user?.role || state.user?.user_role || state.user?.type;
            return role === 'admin' || role === 'administrator';
        },
        isTokenValid(state: AuthState) {
            if (!state.token) return false;

            try {
                const tokenData = this.parseJWT(state.token);
                if (tokenData && tokenData.exp && Date.now() >= tokenData.exp * 1000) {
                    return false; // Token expired
                }
                return true;
            } catch (error) {
                return false; // Invalid token
            }
        }
    },
    actions: {
        sendOtp(payload: any) {
            // payload.mobile_number = `${payload.mobile_code}${payload.mobile_number}`;
            this.$state.mobile_number = payload.mobile_number;
            this.$state.mobile_code = payload.mobile_code;
            this.$state.loading = true;
            return useApi("account/send-otp", {
                method: "POST",
                body: {
                    mobile_number: `${payload.mobile_code}${payload.mobile_number}`,
                    mobile_code: payload.mobile_code
                }},
                {
                    onSuccess:(data) => {
                        if (data.status) {
                            this.setStepComponent(COMPONENTS.VERIFY_OTP_STEP);
                        }
                        this.$state.loading = false;
                    },
                    onError: (err) => {
                        this.$state.loading = false;
                    }
                });
        },
        verifyOtp(payload: {otp : null}) {
            const { setDialogShow } = useApp();
            this.$state.loading = true;
            this.$state.otp = (payload.otp ?? []).join('');
            return useApi("account/verify-otp", {
                method: "POST",
                body: {
                    mobile_number: `${this.$state.mobile_code}${this.$state.mobile_number}`,
                    mobile_code: this.$state.mobile_code,
                    otp : this.$state.otp,
                },
            },{
                onSuccess: (data : any) => {
                    this.$state.loading = false;
                    let response = data.data;
                    console.log('verifyOtp',response);
                    if (response.is_completed) {
                        // this.setStepComponent(COMPONENTS.SEND_OTP_STEP);
                        this.setAuth({
                            user : response,
                            token: response.token,
                        });
                        setDialogShow(false);
                    } else {
                        this.setStepComponent(COMPONENTS.COMPLETE_PROFILE_STEP);
                    }
                },
                onError: (err) => {
                    this.$state.loading = false;
                }
            });
        },
        register(payload: {}) {
            const { setDialogShow } = useApp();
            this.$state.loading = true;
            payload.otp = this.$state.otp;
            payload.mobile_number = `${this.$state.mobile_code}${this.$state.mobile_number}`;
            payload.mobile_code = this.$state.mobile_code;
            this.$state.otp = payload.otp;
            return useApi("user/register", {
                method: "POST",
                body: payload
            },{
                onSuccess: (data : any) => {
                    this.$state.loading = false;
                    let response = data.data;
                    this.setAuth({
                        user : response,
                        token: response.token,
                    });
                    setDialogShow(false);
                },
                onError: (err) => {
                    this.$state.loading = false;
                }
            });
        },
        logout() {
            this.forgetAuth()
        },
        setAuth(payload: { user: {}, token: string }) {
            this.$state.user = payload.user;
            this.$state.token = payload.token;

            // Store token in localStorage and cookies for middleware
            this.storeToken(payload.token);
        },
        forgetAuth() {
            this.$state.token = '';
            this.$state.user = {};

            // Clear token from localStorage and cookies
            this.clearToken();

        navigateTo('/');
        },
        setStepComponent(step: any) {
            this.$state.step = step;
        },

        // Store token in localStorage and cookies
        storeToken(token: string) {
            // Store in localStorage (client-side only)
            if (process.client) {
                localStorage.setItem('auth_token', token);
            }

            // Store in cookie (works on both client and server)
            const authCookie = useCookie('auth_token', {
                default: () => null,
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: false, // Set to false for development (localhost)
                sameSite: 'lax',
            });
            authCookie.value = token;
        },

        // Clear token from localStorage and cookies
        clearToken() {
            // Clear localStorage
            if (process.client) {
                localStorage.removeItem('auth_token');
            }

            // Clear cookie
            const authCookie = useCookie('auth_token');
            authCookie.value = null;
        },

        // Initialize auth state from stored token
        async initAuth() {
            try {
                // Get token from localStorage or cookies
                const token = process.client
                    ? localStorage.getItem('auth_token') || useCookie('auth_token').value
                    : useCookie('auth_token').value;

                if (token && this.isTokenValidFormat(token)) {
                    this.$state.token = token;

                    // Optionally fetch fresh user data
                    await this.fetchUserProfile();
                } else if (token) {
                    // Invalid token, clear it
                    this.clearToken();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                this.forgetAuth();
            }
        },

        // Fetch user profile
        async fetchUserProfile() {
            if (!this.$state.token) return;

            try {
                const response = await useApi('user/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.$state.token}`,
                    },
                });

                if (response.data) {
                    this.$state.user = response.data;
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                // Don't logout on profile fetch error, token might still be valid
            }
        },

        // Check if token format is valid
        isTokenValidFormat(token: string): boolean {
            try {
                const tokenData = this.parseJWT(token);
                return !!tokenData;
            } catch (error) {
                return false;
            }
        },

        // Parse JWT token
        parseJWT(token: string) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        })
                        .join('')
                );
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error('Error parsing JWT:', error);
                return null;
            }
        }
    },
    persist: {
        storage: localStorage,
    },
})