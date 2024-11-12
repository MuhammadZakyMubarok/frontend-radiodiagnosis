import { React, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { baseURL } from "../../../routes/Config";
import { useParams, Link } from "react-router-dom";
// import WithAuthorization from "../../../utils/auth";

const Report = () => {
  // const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState({});
  const [system, setSystem] = useState([]);
  const [manual, setManual] = useState([]);
  const [verificator, setVerificator] = useState([]);

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const mappingDiagnoses = (diagnoses) => {
    let systemDiagnosis = [];
    let manualDiagnosis = [];
    let verificatorDiagnosis = [];

    diagnoses.map((diagnosis) => {
      systemDiagnosis.push({
        tooth: diagnosis.tooth_number,
        diagnosis: diagnosis.system_diagnosis,
      });

      manualDiagnosis.push({
        tooth: diagnosis.tooth_number,
        diagnosis: diagnosis.manual_diagnosis,
      });

      verificatorDiagnosis.push({
        tooth: diagnosis.tooth_number,
        diagnosis: diagnosis.verificator_diagnosis,
      });
    });

    setSystem(systemDiagnosis);
    setManual(manualDiagnosis);
    setVerificator(verificatorDiagnosis);
  };

  console.log(data);

  useEffect(() => {
    axios
      .get(`${baseURL}/radiographics/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          setData(response.data.data);
          mappingDiagnoses(response.data.data.diagnoses);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <div id="report">
      <h6 className="ms-11 mt-2">Radiodiagnosis Report</h6>
      <hr
        style={{
          height: "1px",
          borderWidth: "0 px",
          color: "gray",
          backgroundColor: "gray",
          marginBottom: "0 px",
          marginStart: "0 px",
          width: "100 px",
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 1.5rem' }}>
        <div style={{ paddingBottom: '0.5rem', paddingTop: '0', marginLeft: '1.5rem' }}>
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '100%' }}>
              <div style={{ paddingBottom: '0.5rem', paddingTop: '0' }}>
                {/* Bagian Rekam Medik */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000' }}>Rekam Medik</p>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                    Gambar Panoramik Gigi
                  </p>
                  <img
                    style={{
                      maxWidth: '50%', /* Membatasi lebar gambar agar tidak melebihi lebar kontainer */
                      height: 'auto',    /* Menjaga rasio aspek gambar */
                      objectFit: 'contain', /* Memastikan gambar di-fit dengan proporsional di dalam kontainer tanpa terpotong */
                      paddingLeft: '0',
                      paddingBottom: '1rem',
                      borderRadius: '0.375rem', /* border-radius-xl untuk gambar */
                      alignContent: "center",
                    }}
                    src={`${baseURL + data.panoramik_picture}`}
                    alt="Panoramik Gigi"
                  />
                </div>

                {/* Bagian Nomor Rekam Medis */}
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: '0 0 25%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                      No. Rekam Medis
                    </p>
                  </div>
                  <div style={{ flex: '0 0 33%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#007bff', fontWeight: 'bold' }}>
                      {data.medic_number}
                    </p>
                  </div>
                </div>

                {/* Bagian Nama Pasien */}
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: '0 0 25%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                      Nama Pasien
                    </p>
                  </div>
                  <div style={{ flex: '0 0 33%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#007bff', fontWeight: 'bold' }}>
                      {data.fullname}
                    </p>
                  </div>
                </div>

                {/* Bagian Tanggal Verifikasi */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: '0 0 25%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                      Tanggal Verifikasi
                    </p>
                  </div>
                  <div style={{ flex: '0 0 33%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#007bff', fontWeight: 'bold' }}>
                      {data.panoramik_check_date
                        ? moment(data.panoramik_check_date).format("DD/MM/YYYY")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Bagian Dokter Verifikator */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: '0 0 25%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                      Dokter Verifikator
                    </p>
                  </div>
                  <div style={{ flex: '0 0 33%' }}>
                    <p style={{ fontSize: '0.75rem', color: '#007bff', fontWeight: 'bold' }}>
                      {data.doctor_name ?? "-"}
                    </p>
                  </div>
                </div>

                {/* Bagian Hasil Radiodiagnosis */}
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                    Hasil Radiodiagnosis
                  </p>
                  {data.diagnoses?.map((diagnose) =>
                    diagnose?.system_diagnosis || diagnose?.verificator_diagnosis || diagnose?.manual_diagnosis ? (
                      <div style={{ display: 'flex', marginBottom: '0.5rem' }} key={diagnose?.tooth_number}>
                        <div style={{ flex: '0 0 16.6667%' }}>
                          <ul style={{ paddingLeft: '1rem' }}>
                            <li style={{ fontSize: '0.75rem' }}>Gigi #{diagnose?.tooth_number}</li>
                          </ul>
                        </div>
                        <div style={{ flex: '0 0 83.3333%', paddingLeft: '0' }}>
                          <p style={{ fontSize: '0.75rem', color: '#000', fontWeight: 'bold', marginBottom: '0', paddingBottom: '0.5rem' }}>
                            {diagnose?.system_diagnosis && (
                              <span>
                                {diagnose?.system_diagnosis}
                              </span>
                            )}
                            {diagnose?.verificator_diagnosis && (
                              <span>
                                {diagnose?.system_diagnosis && ', '}
                                {diagnose?.verificator_diagnosis === "dan lain-lain"
                                  ? diagnose.verificator_note + (diagnose.manual_diagnosis ? ", " + diagnose.manual_diagnosis : "")
                                  : diagnose.verificator_diagnosis + (diagnose.manual_diagnosis ? ", " + diagnose.manual_diagnosis : "")
                                }
                              </span>
                            )}
                            {!diagnose?.system_diagnosis && !diagnose?.verificator_diagnosis && diagnose?.manual_diagnosis && (
                              <span>
                                {diagnose?.manual_diagnosis}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) :
                      <div style={{ display: 'flex', marginBottom: '0.5rem', paddingLeft: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#000', fontWeight: 'bold', marginBottom: '0', paddingBottom: '0.5rem' }}>
                          -
                        </p>
                      </div>
                  )}
                </div>

                {/* Bagian Catatan Pasien */}
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                    Catatan Lain
                  </p>
                  <div style={{ display: 'flex', marginBottom: '0.5rem', paddingLeft: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#000', fontWeight: 'bold', marginBottom: '0', paddingBottom: '0.5rem' }}>
                      {data.catatan_pasien ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
