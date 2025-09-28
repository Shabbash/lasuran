<!-- components/address/AddAddressDialog.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 md:h-[90vh] bg-[#EBE4DF] relative">
    <!-- Left: form -->
    <div class="gap-[40px] px-[20px] py-[30px] md:px-[58px] md:py-[46px] flex flex-col justify-between rounded-[30px]">
      <div>
        <h2 class="text-[25px] font-bold text-[#A0576F] mb-[11px]">
          {{ $t('addresses.add_title') }}
        </h2>
        <p class="text-[16px] text-[#5B605C] mb-[60px]">
          {{ $t('addresses.add_subtitle') }}
        </p>

        <!-- Search Address (custom live dropdown) -->
        <div ref="dropdownWrapRef" class="relative mb-[25px] search_icon">
          <input ref="searchInputRef" v-model="searchQuery" type="text"
            class="w-full h-[58px] rounded-[15px] border border-[#A0576F]  text-[#A0576F] ps-[22px] pe-[45px] outline-none bg-white"
            :placeholder="$t('addresses.search_placeholder')" @input="onSearchInput" @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp" @keydown.enter.prevent="onEnter" @keydown.esc.prevent="closeDropdown" />

          <!-- Dropdown (custom) -->
          <div v-if="open && (searching || predictions.length)"
            class="absolute left-0 right-0 mt-2 rounded-xl border border-[#A0576F]/20 bg-white shadow-xl z-[9999]">
            <!-- Loading row -->
            <div v-if="searching" class="px-3 py-2 text-sm text-[#5B605C]">
              {{ $t('addresses.searching') }}
            </div>

            <!-- Predictions -->
            <ul v-else class="max-h-64 overflow-auto py-1">
              <li v-for="(p, idx) in predictions" :key="p.place_id" @click="selectPrediction(idx)"
                class="px-3 py-2 cursor-pointer text-sm"
                :class="idx === activeIndex ? 'bg-[#F3EEEA]' : 'hover:bg-[#F8F5F3]'">
                <div class="font-medium text-[#5F2C3E] truncate">
                  {{ p.structured_formatting?.main_text || p.description }}
                </div>
                <div class="text-xs text-[#6B8B9B] truncate" v-if="p.structured_formatting?.secondary_text">
                  {{ p.structured_formatting.secondary_text }}
                </div>
              </li>

              <li v-if="!predictions.length" class="px-3 py-2 text-sm text-[#5B605C]">
                {{ $t('addresses.no_results') }}
              </li>
            </ul>
          </div>

          <p v-if="searchError" class="text-[12px] text-red-600 mt-2">{{ searchError }}</p>
        </div>

        <!-- Address name -->
        <input v-model="title" type="text"
          class="w-full h-[58px] rounded-[15px] border border-[#A0576F] text-[#A0576F] ps-[22px] pe-[45px] outline-none bg-white"
          :placeholder="$t('addresses.name_placeholder')" />
      </div>
      <BaseButton class="w-full h-[60px] rounded-full text-[20px] text-white bg-[#A0576F] hover:bg-[#8C425B] disabled:bg-[#8C425B] disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="!canSave || saving" @click="handleSave">
        {{ saving ? $t('addresses.saving') : $t('addresses.save_button') }}
      </BaseButton>



    </div>

    <!-- Right: map with a fixed-on-screen center pin -->
    <div class="relative min-h-[360px] bg-[#F3EEEA]">
      <GoogleMap ref="mapRef" class="absolute inset-0" api-key="AIzaSyBubzUGMWZEzfcj4fQaHgrHVugGAcfQB-w"
        :libraries="['places']" :center="center" :zoom="15" :options="mapOptions" @tilesloaded="onTilesLoaded"
        @idle="onMapIdle" />

      <!-- Center pin overlay -->
      <div class="pointer-events-none absolute inset-0 grid place-items-center">
        <img src="/assets/img/map-marker1.svg" width="44" height="44" alt="pin" />
      </div>

      <div
        class="pointer-events-none absolute left-1/2 bottom-3 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] bg-black/60 text-white">
        {{ $t('addresses.drag_hint') }}
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
/**
 * AddAddressDialog.vue — script
 * - Supports add/edit modes with prefill
 * - Live Places predictions (custom dropdown) + reverse geocoding on map drag
 * - Device geolocation as initial center (fallback to Cairo)
 * - Save button uses onSave() prop and exposes "saving" + "canSave"
 * - All comments are in English
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { GoogleMap } from 'vue3-google-map' // keep import for TS awareness

// Emits (optional, in case parent also listens to 'save')
const emit = defineEmits<{ (e: 'save', payload: any): void }>()

// Props
const props = defineProps<{
  mode?: 'add' | 'edit',
  initial?: {
    id?: number
    title?: string | null
    full_address?: string | null
    latitude?: number | null
    longitude?: number | null
  } | null,
  /** Parent-provided async save handler: awaited before modal closes */
  onSave?: (payload: {
    title: string
    full_address: string
    latitude: number
    longitude: number
  }) => Promise<void> | void
}>()

/* -----------------------------
 * Reactive state
 * ----------------------------- */

// Map refs
const mapRef = ref<any>(null)

// Inputs
const title = ref<string>('')
const searchQuery = ref<string>('')        // bound to the search input (also synced from map drags)
const detectedAddress = ref<string>('')    // updated by reverse geocode (also used to fill searchQuery)

// Coordinates (fallback Cairo until device location)
const center = ref<{ lat: number; lng: number }>({ lat: 30.04442, lng: 31.235712 })
const lat = ref(center.value.lat)
const lng = ref(center.value.lng)
const lastCenter = ref<{ lat: number; lng: number } | null>(null)

// UI flags
const locating = ref(false)
const searching = ref(false)
const saving = ref(false)
const searchError = ref('')

// Search dropdown (custom)
const dropdownWrapRef = ref<HTMLElement | null>(null)
const open = ref(false)
const predictions = ref<any[]>([])
const activeIndex = ref<number>(-1)
const sessionToken = ref<any>(null) // AutocompleteSessionToken (reduces billing)
let predTimer: any = null

// Places restrictions (optional)
const COUNTRY_CODE = '' as '' | 'eg' | 'sa' // set if you want to limit results

/* -----------------------------
 * Map options
 * ----------------------------- */
const mapOptions = {
  draggable: true,
  gestureHandling: 'greedy',
  clickableIcons: true,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  zoomControl: true
} as google.maps.MapOptions

/* -----------------------------
 * Prefill for edit mode
 * ----------------------------- */
const prefillFromInitial = () => {
  if (props.mode === 'edit' && props.initial) {
    title.value = props.initial.title ?? ''
    const fa = (props.initial.full_address ?? '').trim()
    searchQuery.value = fa
    detectedAddress.value = fa

    if (props.initial.latitude != null && props.initial.longitude != null) {
      const loc = { lat: Number(props.initial.latitude), lng: Number(props.initial.longitude) }
      center.value = loc
      lat.value = loc.lat
      lng.value = loc.lng
      lastCenter.value = loc
      if (mapRef.value?.map) mapRef.value.map.panTo(loc)
    }
  } else {
    // Add mode — clear fields
    title.value = ''
    searchQuery.value = ''
    detectedAddress.value = ''
    lastCenter.value = { ...center.value }
  }
}

/* -----------------------------
 * Device geolocation (initial)
 * ----------------------------- */
const getDeviceLocation = () => {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) return
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      center.value = coords
      lat.value = coords.lat
      lng.value = coords.lng
      lastCenter.value = coords
      if (mapRef.value?.map) mapRef.value.map.panTo(coords)
      // Trigger an initial reverse geocode
      debouncedReverseGeocode(coords)
      locating.value = false
    },
    () => { locating.value = false },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

/* -----------------------------
 * Reverse geocoding (debounced)
 * ----------------------------- */
let rgTimer: any = null
const debouncedReverseGeocode = (loc: { lat: number; lng: number }) => {
  clearTimeout(rgTimer)
  rgTimer = setTimeout(() => reverseGeocode(loc), 300)
}

const reverseGeocode = (loc: { lat: number; lng: number }) => {
  if (!mapRef.value?.api) return
  const geocoder = new mapRef.value.api.Geocoder()
  geocoder.geocode({ location: loc }, (results: any, status: any) => {
    if (status === 'OK' && results?.[0]) {
      const addr = results[0].formatted_address || ''
      detectedAddress.value = addr
      // Keep the search input in sync with the current map address
      searchQuery.value = addr
    }
  })
}

/* -----------------------------
 * Map events
 * ----------------------------- */
const onTilesLoaded = () => {
  if (!mapRef.value?.map) return
  const c = mapRef.value.map.getCenter().toJSON()
  center.value = c
  lat.value = c.lat
  lng.value = c.lng
  lastCenter.value = c
  debouncedReverseGeocode(c)
}

// Only reverse geocode when user stops dragging/zooming
const onMapIdle = () => {
  if (!mapRef.value?.map) return
  const c = mapRef.value.map.getCenter().toJSON()
  // Limit noisy calls if movement is tiny (~10m)
  if (!lastCenter.value || movedEnough(c, lastCenter.value)) {
    center.value = c
    lat.value = c.lat
    lng.value = c.lng
    lastCenter.value = c
    debouncedReverseGeocode(c)
  }
}

const movedEnough = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = Math.abs(a.lat - b.lat)
  const dLng = Math.abs(a.lng - b.lng)
  return dLat > 0.00009 || dLng > 0.00009 // ~10 meters
}

/* -----------------------------
 * Custom live predictions
 * ----------------------------- */
const onSearchInput = () => {
  open.value = true
  searchError.value = ''
  activeIndex.value = -1
  const q = searchQuery.value.trim()
  if (!q || q.length < 3) {
    predictions.value = []
    sessionToken.value = null
    return
  }
  clearTimeout(predTimer)
  predTimer = setTimeout(fetchPredictions, 220)
}

const fetchPredictions = () => {
  const q = searchQuery.value.trim()
  if (!q || !mapRef.value?.api) return
  const g = mapRef.value.api
  if (!g?.places) return

  if (!sessionToken.value) sessionToken.value = new g.places.AutocompleteSessionToken()

  searching.value = true
  const svc = new g.places.AutocompleteService()
  const req: any = {
    input: q,
    sessionToken: sessionToken.value
  }
  if (COUNTRY_CODE) req.componentRestrictions = { country: [COUNTRY_CODE] }
  if (mapRef.value?.map?.getBounds) req.bounds = mapRef.value.map.getBounds()

  svc.getPlacePredictions(req, (preds: any[], status: any) => {
    searching.value = false
    if (status === 'OK' && preds?.length) {
      predictions.value = preds
      activeIndex.value = 0
    } else {
      predictions.value = []
    }
  })
}

const selectPrediction = (idx: number) => {
  if (idx < 0 || idx >= predictions.value.length || !mapRef.value?.api || !mapRef.value?.map) return
  const g = mapRef.value.api
  const placeId = predictions.value[idx].place_id
  const svc = new g.places.PlacesService(mapRef.value.map)
  svc.getDetails(
    {
      placeId,
      fields: ['geometry', 'formatted_address', 'name'],
      sessionToken: sessionToken.value
    },
    (place: any, status: any) => {
      if (status === 'OK' && place?.geometry?.location) {
        const loc = place.geometry.location.toJSON()
        center.value = loc
        lat.value = loc.lat
        lng.value = loc.lng
        lastCenter.value = loc
        const addr = place.formatted_address || place.name || searchQuery.value
        detectedAddress.value = addr
        searchQuery.value = addr
        if (mapRef.value?.map) {
          mapRef.value.map.panTo(loc)
          mapRef.value.map.setZoom(17)
        }
        // cleanup
        predictions.value = []
        open.value = false
        sessionToken.value = new g.places.AutocompleteSessionToken()
      } else {
        // Text geocode fallback
        geocodeByAddress(searchQuery.value)
      }
    }
  )
}

/* Keyboard navigation for dropdown */
const onArrowDown = () => {
  if (!open.value || !predictions.value.length) return
  activeIndex.value = (activeIndex.value + 1) % predictions.value.length
}
const onArrowUp = () => {
  if (!open.value || !predictions.value.length) return
  activeIndex.value = (activeIndex.value - 1 + predictions.value.length) % predictions.value.length
}
const onEnter = () => {
  if (open.value && predictions.value.length && activeIndex.value >= 0) {
    selectPrediction(activeIndex.value)
  } else {
    geocodeByAddress(searchQuery.value)
    open.value = false
  }
}
const closeDropdown = () => { open.value = false }

/* Click outside to close dropdown */
const onDocClick = (e: MouseEvent) => {
  if (!dropdownWrapRef.value) return
  if (!dropdownWrapRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

/* Fallback text geocode */
const geocodeByAddress = (address: string) => {
  if (!mapRef.value?.api) return
  const geocoder = new mapRef.value.api.Geocoder()
  searching.value = true
  geocoder.geocode(
    {
      address,
      ...(COUNTRY_CODE ? { componentRestrictions: { country: COUNTRY_CODE } } : {})
    } as any,
    (results: any, status: any) => {
      searching.value = false
      if (status === 'OK' && results?.length) {
        const loc = results[0].geometry?.location?.toJSON?.()
        if (loc) {
          center.value = loc
          lat.value = loc.lat
          lng.value = loc.lng
          lastCenter.value = loc
          const addr = results[0].formatted_address || ''
          detectedAddress.value = addr
          searchQuery.value = addr
          if (mapRef.value?.map) {
            mapRef.value.map.panTo(loc)
            mapRef.value.map.setZoom(17)
          }
        }
      } else {
        searchError.value = 'No results found.'
      }
    }
  )
}

/* -----------------------------
 * Save logic
 * ----------------------------- */
const canSave = computed(() => {
  return Boolean(title.value.trim()) && typeof lat.value === 'number' && typeof lng.value === 'number' && !saving.value
})

const handleSave = async () => {
  if (!canSave.value || saving.value) return
  saving.value = true
  const payload = {
    title: title.value.trim(),
    full_address: (detectedAddress.value || searchQuery.value || '').trim(),
    latitude: lat.value,
    longitude: lng.value,
  }
  try {
    if (props.onSave) {
      // استخدم onSave الممرّر من الأب فقط
      await props.onSave(payload)
    } else {
      // أو استخدم الإيميت فقط (لو الأب ما أعطى onSave)
      emit('save', payload)
    }
  } finally {
    saving.value = false
  }
}


/* -----------------------------
 * Lifecycle
 * ----------------------------- */
onMounted(() => {
  document.addEventListener('click', onDocClick)
  prefillFromInitial()
  getDeviceLocation()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  if (rgTimer) clearTimeout(rgTimer)
  if (predTimer) clearTimeout(predTimer)
})

/* -----------------------------
 * Expose to template
 * ----------------------------- */
defineExpose({
  // map
  mapRef, mapOptions, onTilesLoaded, onMapIdle,
  // inputs
  title, searchQuery, detectedAddress, center, lat, lng,
  locating, searching, saving, searchError,
  // dropdown
  dropdownWrapRef, open, predictions, activeIndex,
  onSearchInput, selectPrediction, onArrowDown, onArrowUp, onEnter, closeDropdown,
  // save
  canSave, handleSave
})
</script>


<style scoped>
/* Search icon on the right side */
.search_icon::after {
  content: url(/assets/img/search_icon.svg);
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  height: 25px;
  pointer-events: none;
}

html:lang(ar) .search_icon::after {
  right: unset;
  left: 16px;

}
</style>


<!-- api-key-->
<!-- AIzaSyBubzUGMWZEzfcj4fQaHgrHVugGAcfQB-w -->


<!-- 

api-key="AIzaSyBubzUGMWZEzfcj4fQaHgrHVugGAcfQB-w" 

-->