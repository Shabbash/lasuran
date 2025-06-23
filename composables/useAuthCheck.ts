import { COMPONENTS } from '~/data/constants';

/**
 * Composable for checking authentication and showing login modal if needed
 *
 * @returns {Object} Object containing authentication check functions
 */
export const useAuthCheck = () => {
  const authStore = useAuth();
  const { setDialogComponent, setDialogShow } = useApp();

  /**
   * Check if user is authenticated and show login modal if not
   *
   * @param {Function} onAuthenticated - Callback function to execute if user is authenticated
   * @param {Function} onNotAuthenticated - Optional callback function to execute if user is not authenticated
   * @returns {boolean} True if authenticated, false if not
   */
  const requireAuth = (onAuthenticated?: () => void, onNotAuthenticated?: () => void): boolean => {
    // Check if user has a valid token
    if (!authStore.$state.token) {
      console.log('User not authenticated, showing login modal');

      // Set up the authentication dialog
      authStore.setStepComponent(COMPONENTS.INTRO_STEP);
      setDialogComponent(COMPONENTS.AUTH_WIZARD, {
        modalMaxWidth: 'max-w-[638px]'
      });

      setDialogShow(true);

      // Execute optional callback for not authenticated
      if (onNotAuthenticated) {
        onNotAuthenticated();
      }

      return false;
    }

    // User is authenticated
    console.log('User authenticated');

    // Execute callback if provided
    if (onAuthenticated) {
      onAuthenticated();
    }

    return true;
  };

  /**
   * Check if user is authenticated and has admin privileges
   *
   * @param {Function} onAuthorized - Callback function to execute if user is authorized
   * @param {Function} onNotAuthorized - Optional callback function to execute if user is not authorized
   * @returns {boolean} True if authorized, false if not
   */
  const requireAdmin = (onAuthorized?: () => void, onNotAuthorized?: () => void): boolean => {
    // First check authentication
    if (!requireAuth()) {
      return false;
    }

    // Check admin privileges
    const user = authStore.$state.user;
    const role = user?.role || user?.user_role || user?.type;
    const isAdmin = role === 'admin' || role === 'administrator';

    if (!isAdmin) {
      console.log('User is not admin');

      // Execute optional callback for not authorized
      if (onNotAuthorized) {
        onNotAuthorized();
      }

      return false;
    }

    // User is authorized
    console.log('User is admin');

    // Execute callback if provided
    if (onAuthorized) {
      onAuthorized();
    }

    return true;
  };

  /**
   * Simple check if user is authenticated (without showing modal)
   *
   * @returns {boolean} True if authenticated, false if not
   */
  const isAuthenticated = (): boolean => {
    return !!authStore.$state.token;
  };

  /**
   * Simple check if user is admin (without showing modal)
   *
   * @returns {boolean} True if admin, false if not
   */
  const isAdmin = (): boolean => {
    if (!isAuthenticated()) return false;

    const user = authStore.$state.user;
    const role = user?.role || user?.user_role || user?.type;
    return role === 'admin' || role === 'administrator';
  };

  /**
   * Show authentication dialog manually
   */
  const showAuthDialog = () => {
    authStore.setStepComponent(COMPONENTS.INTRO_STEP);
    setDialogComponent(COMPONENTS.AUTH_WIZARD, {
      modalMaxWidth: 'max-w-[638px]'
    });

    setDialogShow(true);
  };

  return {
    requireAuth,
    requireAdmin,
    isAuthenticated,
    isAdmin,
    showAuthDialog
  };
};
