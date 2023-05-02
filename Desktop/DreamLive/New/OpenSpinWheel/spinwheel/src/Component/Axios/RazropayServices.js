import axios from "axios";

const URL = import.meta.env.VITE_URL_API

export default class RazropayServices {
    static Razrpay(payload) {
        return axios.post(`${URL}/common/DreamSpinWheel/orderId`, payload)
    }

    static RazrpayList() {
        return axios.get(`${URL}/common/DreamSpinWheel/List`)
    }
    static RazrpayDiamond(payload) {
        return axios.post(`${URL}/common/DreamSpinWheel/UserRecharge`, payload)
    }
    static RazrpayGetDiamond(payload) {
        return axios.post(`${URL}/common/DreamSpinWheel/Diamonds`, payload)
    }
    static RazrpayDiamondCredit(payload) {
        return axios.post(`${URL}/common/DreamSpinWheel/DiamondCredit`, payload)
    }
    static RazrpayDiamondList() {
        return axios.get(`${URL}/common/DreamSpinWheel/fetchActiveSegment`)
    }
}