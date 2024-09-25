import { axiosSatuSehat } from "../../utils/axios";

export default () => ({
    searchNIK (params) {
        return axiosSatuSehat.get('patients/Patient', params);
    },
    searchById (id) {
        return axiosSatuSehat.get('patients/Patient/' + id);
    }
})
