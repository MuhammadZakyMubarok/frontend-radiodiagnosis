import { axiosSatuSehatAuth } from "../../utils/axios";

export default () => ({
    generateToken (payload) {
        return axiosSatuSehatAuth.post('/access-token', payload);
    }
})
