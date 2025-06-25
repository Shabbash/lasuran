
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

};
export default components;