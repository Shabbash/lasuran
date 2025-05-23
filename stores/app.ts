import { defineStore } from "pinia";
import { DELIVERY_METHOD, DEVICE_TYPES, SERVICE_TYPES } from "~/data/constants";
import type { AppState } from '~/types/app';
import  components from "~/components/import";

export const useApp = defineStore("app", {
    state: () : AppState => {
        return {
          locale: "en",
          serviceType: SERVICE_TYPES.RESERVATION,
          deliveryMethod: DELIVERY_METHOD.RESERVATION,
          deviceType: DEVICE_TYPES.WEB,
          dialog: {
            show: false,
            options: {},
            component: '',
            data: {}
          }
        }
    },
    getters: {
        getLocale(state:AppState) {
            return state.locale;
        },
        getServiceType(state:AppState) {
            return state.serviceType;
        },
        getDeliveryMethod(state:AppState) {
            return state.deliveryMethod;
        },
        getDeviceType(state:AppState) {
            return state.deviceType;
        },
        getDialogShow(state:AppState) {
            return state.dialog.show;
        },
        getDialogComponent(state:AppState) {
            const componentKey = state.dialog.component;
            console.log("components[component] ", componentKey in components ? components[componentKey] : null);
            return (componentKey in components) ? components[componentKey] : state.dialog.component;
        }
    },
    actions: {
        setLocale(locale : string)  {
            this.$state.locale = locale;
        },
        setServiceType(serviceType :string) {
            this.$state.serviceType = serviceType;
        },
        setDeliveryMethod(deliveryMethod :string) {
            this.$state.deliveryMethod = deliveryMethod;
        },
        setDeviceType(deviceType :string) {
            this.$state.deviceType = deviceType;
        },
        setDialogComponent(component: string) {
            this.dialog.component = component;
        },
        setDialogShow(show: boolean) {
            this.dialog.show = show;
        },
        setDialogOptions(options: object | []){
            this.dialog.data = options
        },
    },
    persist: true,
});