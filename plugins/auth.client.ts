export default defineNuxtPlugin(async () => {
  const authStore = useAuth();

  // Initialize auth state from stored token
  if (authStore.initAuth) {
    await authStore.initAuth();
  } else {
    // Fallback initialization if initAuth method doesn't exist
    const token = localStorage.getItem('auth_token');
    if (token && authStore.isTokenValidFormat && authStore.isTokenValidFormat(token)) {
      authStore.$state.token = token;

      // Optionally fetch user profile if method exists
      if (authStore.fetchUserProfile) {
        await authStore.fetchUserProfile();
      }
    }
  }
});
