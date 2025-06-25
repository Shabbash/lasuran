import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface ContactFormData {
    category: number;
    order_id?: string;
    message: string;
    attachments?: File[];
}

export const useContact = defineStore("contact", {
    state: () => {
        return {
            isSubmitting: false,
            error: null as string | null,
            submitSuccess: false,
        }
    },

    getters: {
        isLoading(state): boolean {
            return state.isSubmitting;
        }
    },

    actions: {
        async submitFeedback(formData: ContactFormData, onSuccess: Function = () => {}) {
            this.$state.isSubmitting = true;
            this.$state.error = null;
            this.$state.submitSuccess = false;

            try {
                // Prepare FormData for file uploads
                const submitData = new FormData();
                
                // Add required fields
                submitData.append('category', String(formData.category));
                submitData.append('message', formData.message);
                
                // Add optional order_id if provided
                if (formData.order_id) {
                    submitData.append('order_id', formData.order_id);
                }
                
                // Add attachments if provided
                if (formData.attachments && formData.attachments.length > 0) {
                    formData.attachments.forEach((file, index) => {
                        submitData.append(`attachments[${index}]`, file);
                    });
                }

                const response = await useApi('customer-service/create-feedback', {
                    method: 'POST',
                    body: submitData
                });

                if (response.status) {
                    this.$state.submitSuccess = true;
                    this.$state.error = null;

                    // Show success message
                    const toast = useToast();
                    toast.add({
                        title: response.message || 'Feedback submitted successfully',
                        color: 'success'
                    });

                    onSuccess(response);
                    return { success: true, data: response.data };
                } else {
                    throw new Error(response.message || 'Failed to submit feedback');
                }
            } catch (error: any) {
                console.error('Error submitting feedback:', error);
                this.$state.error = error?.message || 'Failed to submit feedback';

                // Show error message
                const toast = useToast();
                toast.add({
                    title: this.$state.error,
                    color: 'error'
                });

                return { success: false, error: this.$state.error };
            } finally {
                this.$state.isSubmitting = false;
            }
        },

        clearError() {
            this.$state.error = null;
            this.$state.submitSuccess = false;
        },

        resetForm() {
            this.$state.error = null;
            this.$state.submitSuccess = false;
            this.$state.isSubmitting = false;
        }
    }
});
