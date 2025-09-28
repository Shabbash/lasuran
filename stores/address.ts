// ~/stores/address.ts
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export type Address = {
  id: number
  title: string | null
  description?: string | null
  building_number?: string | null
  latitude?: number | null
  longitude?: number | null
  full_address?: string | null
  street_name?: string | null
  city_name?: string | null
  neighborhood?: string | null
  is_preferred: boolean
}

type ApiListResponse =
  | Address[]
  | {
    status?: boolean
    status_code?: number
    message?: string
    data?: Address[] | { data?: Address[] }
  }

function extractAddresses(res: ApiListResponse): Address[] {
  if (Array.isArray(res)) return res
  const d: any = (res as any)?.data
  if (Array.isArray(d)) return d
  if (d && Array.isArray(d.data)) return d.data
  return []
}

export const useAddresses = defineStore('addresses', {
  state: () => ({
    isLoading: false as boolean,
    isSettingPreferred: false as boolean,
    error: null as string | null,
    items: [] as Address[],
    /** Keep last locally selected id to reconcile with server results */
    selectedId: null as number | null,
    lastLoadedAt: 0 as number,
  }),

  getters: {
    list: (s) => s.items,
    preferred: (s) => s.items.find(a => a.is_preferred),
    preferredId(): number | null { return this.preferred?.id ?? null },
    sorted(s): Address[] {
      const list = [...s.items]
      return list.sort((a, b) => {
        if (a.is_preferred && !b.is_preferred) return -1
        if (!a.is_preferred && b.is_preferred) return 1
        return (b.id ?? 0) - (a.id ?? 0)
      })
    },
    byId: (s) => (id: number) => s.items.find(a => a.id === id),
  },

  actions: {
    /** Preserve local preferred if server didn't return one */
    _reconcilePreferredAfterFetch(next: Address[]) {
      const serverHasPreferred = next.some(a => a.is_preferred)
      if (serverHasPreferred) return next

      const keepId = this.selectedId
      if (!keepId) return next
      return next.map(a => ({ ...a, is_preferred: a.id === keepId }))
    },

    /** GET /addresses (memoized ~60s unless force=true) */
    fetchAddresses(force = false) {
      if (!force && this.lastLoadedAt && Date.now() - this.lastLoadedAt < 60_000 && this.items.length) {
        return Promise.resolve()
      }
      this.isLoading = true
      this.error = null

      return useApi('addresses', { method: 'GET' }, {
        onSuccess: (data: any) => {
          const raw = extractAddresses(data as ApiListResponse)
          const reconciled = this._reconcilePreferredAfterFetch(raw)
          this.items = reconciled
          this.lastLoadedAt = Date.now()
          this.isLoading = false
        },
        onError: (err: any) => {
          this.error = err?.message || 'Failed to load addresses'
          this.isLoading = false
        }
      })
    },

    /** POST /addresses — returns the created Address (best-effort) */
    /** POST /addresses — returns the created Address (best-effort) */
    createAddress(payload: Partial<Address>) {
      this.isLoading = true
      this.error = null

      // Always include is_preferred as 0/1 inside body
      const body: any = {
        ...payload,
        is_preferred: Number(Boolean((payload as any)?.is_preferred ?? 0)),
      }

      // Wrap in Promise to return created item
      return new Promise<Address>((resolve, reject) => {
        useApi('addresses', { method: 'POST', body }, {
          onSuccess: async (res: any) => {
            try {
              this.isLoading = false

              // Try to extract created address from response
              let created: Address | null = null
              const maybe = (res && (res.data || res?.data?.data)) as any
              if (maybe && !Array.isArray(maybe)) {
                created = maybe as Address
              }

              // Refetch to ensure freshest list
              await this.fetchAddresses(true)

              // If still unknown, attempt to match by address/coords
              if (!created) {
                const fa = (payload.full_address || '').trim().toLowerCase()
                const lat = Number((payload.latitude ?? 0 as number).toFixed?.(6) ?? payload.latitude ?? 0)
                const lng = Number((payload.longitude ?? 0 as number).toFixed?.(6) ?? payload.longitude ?? 0)
                created = this.items.find(a =>
                  (a.full_address || '').trim().toLowerCase() === fa &&
                  Number((a.latitude ?? 0 as number).toFixed?.(6) ?? a.latitude ?? 0) === lat &&
                  Number((a.longitude ?? 0 as number).toFixed?.(6) ?? a.longitude ?? 0) === lng
                ) || null
              }

              resolve(created || (payload as Address))
            } catch (e) {
              reject(e)
            }
          },
          onError: (err: any) => {
            this.error = err?.message || 'Failed to create address'
            this.isLoading = false
            reject(err)
          }
        })
      })
    }
    ,

    /** PUT /addresses/:id */
    /** PUT /addresses/:id — send full payload incl. is_preferred to avoid 422 */
    updateAddress(id: number, overrides: Partial<Address>) {
      this.isLoading = true
      this.error = null

      // Get current item so we can include required fields on PUT
      const current = this.items.find(a => a.id === id)

      // Build safe body: backend expects full object (especially is_preferred & title)
      const body: any = {
        // required / commonly-validated fields
        title: overrides.title ?? current?.title ?? 'Address',
        full_address: overrides.full_address ?? current?.full_address ?? '',
        description: overrides.description ?? current?.description ?? null,
        building_number: overrides.building_number ?? current?.building_number ?? null,
        street_name: overrides.street_name ?? current?.street_name ?? null,
        city_name: overrides.city_name ?? current?.city_name ?? null,
        neighborhood: overrides.neighborhood ?? current?.neighborhood ?? null,

        // coordinates (keep existing if not provided)
        latitude: overrides.latitude ?? current?.latitude ?? null,
        longitude: overrides.longitude ?? current?.longitude ?? null,

        // ALWAYS send as 0/1 (not boolean) to satisfy validator
        is_preferred:
          overrides?.is_preferred != null
            ? (overrides.is_preferred ? 1 : 0)
            : (current?.is_preferred ? 1 : 0),
      }

      return useApi(`addresses/${id}`, { method: 'PUT', body }, {
        onSuccess: async () => {
          this.isLoading = false
          await this.fetchAddresses(true) // refresh list so UI sees the change
        },
        onError: (err: any) => {
          this.error = err?.message || 'Failed to update address'
          this.isLoading = false
        }
      })
    }
    ,

    /** PUT /addresses/:id { is_preferred: true } — optimistic w/o refetch */
    async setPreferred(id: number) {
      if (this.isSettingPreferred) return
      this.isSettingPreferred = true
      this.error = null

      // Find the current address payload (so we can include required fields)
      const current = this.items.find(a => a.id === id)

      // Optimistic UI update
      const prev = [...this.items]
      this.selectedId = id
      this.items = this.items.map(a => ({ ...a, is_preferred: a.id === id }))

      try {
        // Build a safe body. Many backends require "title" even on PUT.
        // We include existing fields to avoid 422 validation errors.
        const body: any = {
          title: (current?.title ?? 'Address'),
          full_address: (current?.full_address ?? ''),
          description: (current?.description ?? null),
          building_number: (current?.building_number ?? null),
          latitude: (current?.latitude ?? null),
          longitude: (current?.longitude ?? null),
          street_name: (current?.street_name ?? null),
          city_name: (current?.city_name ?? null),
          neighborhood: (current?.neighborhood ?? null),
          // Always send as 0/1 to be backend-friendly
          is_preferred: 1
        }

        await useApi(`addresses/${id}`, { method: 'PUT', body })
        // Keep optimistic state on success
      } catch (err: any) {
        // Rollback optimistic UI on failure
        this.items = prev
        this.selectedId = this.preferred?.id ?? null
        this.error = err?.message || 'Failed to set preferred address'
      } finally {
        this.isSettingPreferred = false
      }
    },

    /** DELETE /addresses/:id */
    deleteAddress(id: number) {
      this.isLoading = true
      this.error = null
      return useApi(`addresses/${id}`, { method: 'DELETE' }, {
        onSuccess: () => {
          this.items = this.items.filter(a => a.id !== id)
          if (this.selectedId === id) this.selectedId = null
          this.isLoading = false
        },
        onError: (err: any) => {
          this.error = err?.message || 'Failed to delete address'
          this.isLoading = false
        }
      })
    },
  },

  persist: {
    storage: localStorage,
    paths: ['items', 'selectedId', 'lastLoadedAt'],
  },
})
