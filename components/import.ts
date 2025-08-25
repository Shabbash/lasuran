
import {COMPONENTS} from "~/data/constants";
import Wizard from "~/components/auth/Wizard.vue";
import IntroStep from "~/components/auth/IntroStep.vue";
import CompleteProfileStep from "~/components/auth/CompleteProfile.vue";
import SendOtpStep from "~/components/auth/SendOtpStep.vue";
import VerifyOtpStep from "~/components/auth/VerifyOtpStep.vue";
import ServiceShow from "~/components/service/Show.vue";
import ServiceGuest from "~/components/service/Guest.vue";
import ServiceAppointment from "~/components/service/Appointment.vue";
import ServiceSuccess from "~/components/service/Success.vue";
import Selection from "~/components/payment/Selection.vue";
import Cards from "~/components/payment/Cards.vue";
import CreateCard from "~/components/payment/CreateCard.vue";
import PaymentLoading from "~/components/payment/Loading.vue";
import ConfirmDialog from '~/components/base/ConfirmDialog.vue'
import MyGiftCardsDialog from '~/components/cart/MyGiftCardsDialog.vue'
import CheckoutPaymentDialog from '@/components/cart/CheckoutPaymentDialog.vue'
import BranchShow from '@/components/branch/Show.vue'
import ShopShow from '~/components/shop/Show.vue';
import InviteFriends from '@/components/base/InviteFriends.vue'
import BookingShow from '@/components/booking/Show.vue'
import GiftCardRedeemHistory from '@/components/giftcards/GiftCardRedeemHistory.vue'
import GiftCardDetails from '@/components/giftcards/GiftCardDetails.vue'
import LoyaltyInfoDialog from '@/components/wallet/LoyaltyInfoDialog.vue'
import GiftedOrderDialog from '@/components/cart/GiftedOrderDialog.vue'
import ScheduleGiftedOrder from '~/components/cart/ScheduleGiftedOrder.vue'
import GiftedOrderDetailsDialog from '~/components/booking/GiftedOrderDetailsDialog.vue'; 



const components: {} = {
    [COMPONENTS.AUTH_WIZARD] : Wizard,
    [COMPONENTS.INTRO_STEP] : IntroStep,
    [COMPONENTS.SEND_OTP_STEP] : SendOtpStep,
    [COMPONENTS.VERIFY_OTP_STEP] : VerifyOtpStep,
    [COMPONENTS.COMPLETE_PROFILE_STEP] : CompleteProfileStep,
    [COMPONENTS.SERVICE_SHOW] : ServiceShow,
    [COMPONENTS.SERVICE_GUEST] : ServiceGuest,
    [COMPONENTS.SERVICE_APPOINTMENT] : ServiceAppointment,
    [COMPONENTS.SERVICE_SUCCESS] : ServiceSuccess,
    [COMPONENTS.PAYMENT_SELECTION] : Selection,
    [COMPONENTS.PAYMENT_CARDS] : Cards,
    [COMPONENTS.PAYMENT_CREATE_CARD] : CreateCard,
    [COMPONENTS.PAYMENT_LOADING] : PaymentLoading,
    [COMPONENTS.CONFIRM_DIALOG]: ConfirmDialog,
    [COMPONENTS.MY_GIFT_CARDS_DIALOG]: MyGiftCardsDialog,
    [COMPONENTS.CHECKOUT_PAYMENT_DIALOG]: CheckoutPaymentDialog,
    [COMPONENTS.BRANCH_SHOW]: BranchShow,
    [COMPONENTS.SHOP_SHOW]: ShopShow,
    [COMPONENTS.INVITE_FRIENDS]: InviteFriends,
    [COMPONENTS.BOOKING_SHOW]: BookingShow,
    [COMPONENTS.GIFT_CARD_REDEEM_HISTORY]: GiftCardRedeemHistory,
    [COMPONENTS.GIFT_CARD_DETAILS]: GiftCardDetails,
    [COMPONENTS.LOYALTY_INFO]: LoyaltyInfoDialog,
    [COMPONENTS.GIFTED_ORDER_DIALOG]: GiftedOrderDialog,
    [COMPONENTS.SCHEDULE_GIFTED_ORDER]: ScheduleGiftedOrder,
    [COMPONENTS.GIFTED_ORDER_DETAILS]: GiftedOrderDetailsDialog, 


};
export default components;