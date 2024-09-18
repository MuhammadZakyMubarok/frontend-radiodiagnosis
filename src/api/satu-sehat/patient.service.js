import { axiosSatuSehat } from "../../utils/axios";

export default () => ({
    searchNIK (params) {
        return axiosSatuSehat.get('/Patient', params);
    },
    searchById (id) {
        return axiosSatuSehat.get('/Patient/' + id);
    }
})
