export const SERVICE_TYPES = { 
    FOOD: "food_ordering",
    ONLINE: "online_store",
    RESERVATION: "service_reservation"
}

export const DELIVERY_METHOD = { 
    PICKUP: "pickup",
    RESERVATION: "srvc_resv"
};

export const DEVICE_TYPES = { 
    WEB: "WEB"
};

export const COMPONENTS = {
    AUTH_WIZARD: "AuthWizard",
    INTRO_STEP: "IntroStep",
    SEND_OTP_STEP: "SendOtpStep",
    VERIFY_OTP_STEP: "VerifyOtpStep",
    COMPLETE_PROFILE_STEP: "CompleteProfileStep",
    SERVICE_SHOW: "ServiceShow",
    SERVICE_GUEST: "ServiceGuest",
    SERVICE_APPOINTMENT: "ServiceAppointment",
    SERVICE_SUCCESS: "ServiceSuccess",
    PAYMENT_SELECTION: "PaymentSelection",
    PAYMENT_CARDS: "PaymentCards",
    PAYMENT_CREATE_CARD: "PaymentCreateCard",
    PAYMENT_LOADING: "PaymentLoading",
    CONFIRM_DIALOG: "ConfirmDialog",
    MY_GIFT_CARDS_DIALOG: 'MyGiftCardsDialog',
    CHECKOUT_PAYMENT_DIALOG: 'CHECKOUT_PAYMENT_DIALOG',
    BRANCH_SHOW: 'BranchShow',
    SHOP_SHOW: 'ShopShow',
    INVITE_FRIENDS: 'InviteFriends',
    BOOKING_SHOW: "BookingShow",
    GIFT_CARD_REDEEM_HISTORY: "GiftCardRedeemHistory",
    GIFT_CARD_DETAILS: "GiftCardDetails",
    LOYALTY_INFO: "LoyaltyInfoDialog",
    GIFTED_ORDER_DIALOG: "GiftedOrderDialog",
    SCHEDULE_GIFTED_ORDER: "ScheduleGiftedOrder",
    GIFTED_ORDER_DETAILS: 'GiftedOrderDetailsDialog', // NEW


}

export default { 
    SERVICE_TYPES,
    DELIVERY_METHOD,
    DEVICE_TYPES
}