import { computed } from 'vue'
import { useBranches } from '@/stores/branches'

export const useBranchesApi = () => {
  const branchesStore = useBranches()

  const fetchBranches = async () => {
    return await branchesStore.fetchBranches()
  }

  const getBranchById = (id: number) => {
    return branchesStore.getBranchById(id)
  }

  const getBranchesByCity = (city: string) => {
    return branchesStore.getBranchesByCity(city)
  }

  const getOpenBranches = () => {
    return branchesStore.getOpenBranches
  }

  const getAvailableCities = () => {
    return branchesStore.getAvailableCities
  }

  return {
    // Store state
    branches: computed(() => branchesStore.getBranches),
    isLoading: computed(() => branchesStore.isLoading),
    error: computed(() => branchesStore.error),
    availableCities: computed(() => branchesStore.getAvailableCities),
    openBranches: computed(() => branchesStore.getOpenBranches),

    // Actions
    fetchBranches,
    getBranchById,
    getBranchesByCity,
    getOpenBranches,
    getAvailableCities,
    clearError: branchesStore.clearError,
    setSelectedCity: branchesStore.setSelectedCity
  }
}
