<template>
  <Container>
    <Banner :opacity="false" :bannerContent="bannerContent" />

    <div>
      <h2 class="text-white mb-[16px] text-[19px] font-normal">Gift Cards</h2>
      <p class="hint text-[#C6C6C7] text-[13px] font-[350] flex items-center gap-[10px] mb-[15px]">
        {{ giftCards[0]?.single_use_message || 'The gift card is valid for one time use only.' }}
      </p>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button @click="fetchGiftCards" class="bg-[#A0576F] text-white px-4 py-2 rounded-lg hover:bg-[#913E5D]">
          Try Again
        </button>
      </div>

      <!-- Gift Cards Grid -->
      <div v-else-if="giftCards.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(card, index) in giftCards" :key="card.id || index" class="relative cursor-pointer"
          @click="openCardModal(card)">
          <div class="w-full h-full">
            <img class="w-full h-full cover" :src="card.card_image"
                 :alt="card.name || 'Gift card image'"
                 @error="(e) => (e.target as HTMLImageElement).src = '/assets/img/default-gift-card.png'" />
          </div>
          <div class="flex items-center justify-between absolute inset-0 px-[17px] py-[15px]">
            <div class="flex flex-col justify-between h-full">
              <div>
                <h2 class="text-white text-[15px] font-bold leading-normal">{{ card.title || 'Gift Card' }}</h2>
                <h3 class="text-white text-[40px] font-bold leading-normal">
                  {{ card.price || 0 }} <span class="text-[20px]">SAR</span>
                </h3>
              </div>
              <p class="text-white text-[11px] font-bold leading-normal">
                  {{ card.name || 'Lasuran Gift Card' }}
              </p>
            </div>
            <div v-if="card.logo">
              <img :src="card.logo" alt="logo" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-[#C6C6C7] text-lg mb-4">No gift cards available at the moment</p>
        <button @click="fetchGiftCards" class="bg-[#A0576F] text-white px-4 py-2 rounded-lg hover:bg-[#913E5D]">
          Refresh
        </button>
      </div>
    </div>


    <!-- Gift Card Modal -->
    <Dialog v-model:show="modalOpen" :modalMaxWidth="'max-w-[539px]'">
      <template #body>
        <div class="bg-decore-modal mx-auto rounded-[30px] overflow-hidden shadow-lg bg-[#EBE4DF] text-[#5F2C3E]">
          <div class="relative px-[28px] mt-[28px] mb-[40px]">
            <h2 class="text-center text-[23px] font-bold text-[#A0576F] mb-[40px]">Lasuran Gift Card</h2>

            <div v-if="selectedCard" class="relative">
              <div class="w-full h-full">
                <img class="w-full h-full cover" :src="selectedCard.card_image"
                     :alt="selectedCard.name || 'Gift card image'"
                     @error="(e) => (e.target as HTMLImageElement).src = '/assets/img/default-gift-card.png'" />
              </div>
              <div class="flex items-center justify-between absolute inset-0 px-[17px] py-[15px]">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <h2 class="text-white text-[15px] font-bold leading-normal">{{ selectedCard?.title || 'Gift Card' }}</h2>
                    <h3 class="text-white text-[40px] font-bold leading-normal">
                      {{ selectedCard?.price || 0 }} <span class="text-[20px]">SAR</span>
                    </h3>
                  </div>
                  <p class="text-white text-[11px] font-bold leading-normal">
                    expires: {{ selectedCard?.expiry_date || '2025-12-31' }}
                  </p>
                </div>
                <div v-if="selectedCard?.logo">
                  <img :src="selectedCard.logo" alt="logo" />
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center mt-[40px] mb-[15px]">
              <h2 class="text-[30px] font-bold text-[#A0576F] leading-normal">{{ selectedCard?.title || 'Gift Card' }}</h2>
              <p class="text-[19px] font-bold text-[#A0576F] leading-normal">{{ selectedCard?.price || 0 }} SAR</p>
            </div>

            <div class="text-[#5B605C] mb-[16px] text-[14px] font-[350] leading-[23.128px]"
                 v-html="selectedCard?.description || 'Give the perfect gift with a Lasuran gift card. Valid for all services and products at our salon.'">
            </div>

            <p v-if="selectedCard?.single_use_message" class="text-[#5B605C] mb-[16px] text-[12px] font-[350] italic">
              {{ selectedCard.single_use_message }}
            </p>

            <div class="flex justify-between items-center gap-[25px] mt-[55px]">

              <BaseCounter v-model="quantity" />
              <BaseButton @click="checkoutGiftCard" :loading="isCheckingOut" :disabled="!selectedCard"
                class="cart-btn flex align-center gap-[10px] w-full text-white rounded-full font-[400] text-[16px] justify-center disabled:bg-[#A0576F] hover:bg-[#913E5D]"
                :class="selectedCard ? 'bg-[#A0576F]' : 'bg-[#a0576f69]'">

                <PriceIcon />
                <span>Buy Now: {{ totalPrice }} SAR</span>


              </BaseButton>

            </div>

          </div>
        </div>


      </template>
    </Dialog>


  </Container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Container from '@/components/base/Container.vue'
import Banner from '@/components/base/Banner.vue'
import Dialog from '@/components/base/Dialog.vue'
import BaseCounter from '@/components/base/Counter.vue'
import BaseButton from '@/components/base/Button.vue'
import PriceIcon from '@/components/icons/PriceIcon.vue'
// Reactive state
const modalOpen = ref(false)
const selectedCard = ref<any>(null)
const quantity = ref(1)

// API state
const isLoading = ref(false)
const error = ref<string | null>(null)
const giftCards = ref<any[]>([])
const pagination = ref<any>(null)

const openCardModal = (card: any) => {
  selectedCard.value = card
  quantity.value = 1
  modalOpen.value = true
}

const closeCardModal = () => {
  modalOpen.value = false
  selectedCard.value = null
  quantity.value = 1
}

// Fetch gift cards from API
const fetchGiftCards = async () => {
  isLoading.value = true
  error.value = null

  try {
    console.log('Fetching gift cards from API...')

    const { data: response, error: apiError } = await useApi('vouchers/list_available', {
      method: 'GET'
    })

    console.log('Gift cards API response:', response)
    console.log('API error:', apiError)

    if (apiError.value) {
      throw new Error(apiError.value?.message || 'Failed to fetch gift cards')
    }

    const apiData = response.value
    if (apiData?.status && apiData?.data) {
      // Transform API data to match our UI expectations
      giftCards.value = apiData.data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        title: item.name,
        description: item.description,
        price: item.price,
        card_image: item.card_image,
        cover_image: item.cover_image,
        logo: item.logo || '/assets/img/logo-white.svg', // Fallback logo
        single_use_message: item.single_use_message,
        redeemed_multiple_times: item.redeemed_multiple_times,
        number_of_gift_card: item.number_of_gift_card,
        files: item.files || []
      }))

      pagination.value = apiData.data.pagination_options

      console.log('Gift cards loaded successfully:', giftCards.value.length)
    } else {
      throw new Error(apiData?.message || 'Failed to fetch gift cards')
    }
  } catch (err: any) {
    console.error('Error fetching gift cards:', err)
    error.value = err?.message || 'Failed to load gift cards'

    // Fallback to empty array on error
    giftCards.value = []
  } finally {
    isLoading.value = false
  }
}

// Initialize gift cards on component mount
onMounted(async () => {
  console.log('Gift cards page mounted, fetching data...')
  await fetchGiftCards()
})

const totalPrice = computed(() => {
  if (!selectedCard.value || !selectedCard.value.price) return 0

  const price = Number(selectedCard.value.price)
  const qty = Number(quantity.value) || 1

  return isNaN(price) ? 0 : price * qty
})

// Direct checkout for gift cards
const isCheckingOut = ref(false)
const paymentMethods = ref<any[]>([])

// Fetch payment methods first
const fetchPaymentMethods = async () => {
  try {
    const { data: response, error: apiError } = await useApi('cart', {
      method: 'GET'
    })

    if (!apiError.value && response.value?.data?.payment_methods) {
      paymentMethods.value = response.value.data.payment_methods
      console.log('Payment methods loaded:', paymentMethods.value)
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

const checkoutGiftCard = async () => {
  if (!selectedCard.value) return

  isCheckingOut.value = true

  try {
    console.log('Starting gift card checkout:', selectedCard.value)

    // Fetch payment methods if not already loaded
    if (paymentMethods.value.length === 0) {
      await fetchPaymentMethods()
    }

    // Use a single, simple payload structure
    const paymentMethodId = paymentMethods.value.length > 0 ? paymentMethods.value[0].id : 1

    const checkoutPayload: any = {
      type: 'Person',
      voucher_groups_id: selectedCard.value.id,
      quantity: quantity.value,
      payment_method_id: paymentMethodId
    }

    console.log('Single checkout attempt with payload:', checkoutPayload)

    // Make a single API call
    const { data: response, error: apiError } = await useApi('vouchers/checkout', {
      method: 'POST',
      body: checkoutPayload
    })

    console.log('Gift card checkout API response:', response)
    console.log('Gift card checkout API error:', apiError)

    if (apiError?.value) {
      // Log detailed error information for debugging
      console.error('Detailed API error:', apiError.value)

      // Extract validation errors if available
      let errorMessage = 'Failed to checkout gift card'

      try {
        const errorData = apiError.value as any
        if (errorData?.data?.errors) {
          const validationErrors = Object.values(errorData.data.errors).flat()
          errorMessage = (validationErrors as string[]).join(', ')
        } else if (errorData?.data?.message) {
          errorMessage = String(errorData.data.message)
        } else if (errorData?.message) {
          errorMessage = String(errorData.message)
        }
      } catch (e) {
        console.error('Error parsing API error:', e)
      }

      throw new Error(errorMessage)
    }

    const apiData = response?.value
    if (apiData?.status) {
      console.log('Gift card checkout successful!')

      // Handle successful checkout
      if (apiData.data) {
        // If there's a payment URL, open payment window
        if (apiData.data.payment?.create_token_url?.url) {
          console.log('Opening payment window for gift card...')
          const paymentUrl = apiData.data.payment.create_token_url.url

          // Open payment window
          const paymentWindow = window.open(
            paymentUrl,
            'payment',
            'width=600,height=700,scrollbars=yes,resizable=yes'
          )

          if (paymentWindow) {
            // Monitor payment window
            const checkClosed = setInterval(() => {
              if (paymentWindow.closed) {
                clearInterval(checkClosed)
                console.log('Payment window closed')
                // You can add payment status check here
                closeCardModal()
              }
            }, 1000)
          }
        } else {
          // No payment needed or already processed
          console.log('Gift card order completed without payment window')
          closeCardModal()

          // Show success message
          alert('Gift card purchased successfully!')
        }
      }
    } else {
      throw new Error(apiData?.message || 'Failed to checkout gift card')
    }
  } catch (error: any) {
    console.error('Error during gift card checkout:', error)

    // Show user-friendly error message
    const errorMessage = error.message || 'An unexpected error occurred during checkout'
    alert(`Checkout failed: ${errorMessage}`)

    // Keep modal open so user can try again
  } finally {
    isCheckingOut.value = false
  }
}

// Banner Content
const bannerContent = {
  image: "/assets/img/gift-cards.svg",
  subtitle: "Give the Gift of Lasuran",
  title: "Gift Cards"
}

// Gift cards are now loaded from API via fetchGiftCards()
</script>


<style>
.hint::before {
  content: url(/assets/img/info-icon.svg);
}
</style>
