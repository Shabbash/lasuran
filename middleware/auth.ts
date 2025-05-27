import { COMPONENTS } from '~/data/constants';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuth();

  // Check if user is authenticated by checking the token directly
  if (!authStore.$state.token) {
    console.log('User not authenticated, redirecting to home');

    // If on client side, trigger the authentication dialog
    if (import.meta.client) {
      // Use nextTick to ensure the redirect happens first
      nextTick(() => {
        const { setDialogComponent, setDialogShow } = useApp();

        // Set up the authentication dialog
        authStore.setStepComponent(COMPONENTS.INTRO_STEP);
        setDialogComponent(COMPONENTS.AUTH_WIZARD);
        setDialogShow(true);
      });
    }

    // Redirect to home page
    return navigateTo('/');
  }
});
