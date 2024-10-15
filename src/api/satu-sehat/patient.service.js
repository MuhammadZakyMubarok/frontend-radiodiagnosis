import { axiosSatuSehat } from "../../utils/axios";

export default () => ({
    searchNIK (params) {
        const { nik } = params;
        return axiosSatuSehat.get('/Patient/by-nik', {
            params: {
                nik
            }
        });
    },
    searchByNIKIbu(params) {
      const { nik } = params;
      return axiosSatuSehat.get('/Patient/by-nik-ibu', {
          params: {
              nik
          }
      })
    },
    searchByNameBirthdateIdentifier(params) {
      const { name, birthdate, identifier } = params;
      return axiosSatuSehat.get('/Patient/by-name-birthdate-identifier', {
          params: {
              name,
              birthdate,
              identifier
          }
      })
    },
    searchByNameBirthdateGender(params) {
        const { name, birthdate, gender } = params;
        return axiosSatuSehat.get('/Patient/by-name-birthdate-gender', {
            params: {
                name,
                birthdate,
                gender
            }
        })
    },
    searchById (id) {
        return axiosSatuSehat.get('/Patient/' + id);
    }
})
