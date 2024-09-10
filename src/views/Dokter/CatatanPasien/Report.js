import { React, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { baseURL } from "../../../routes/Config";
import { useParams, Link } from "react-router-dom";
import WithAuthorization from "../../../utils/auth";

const Report = () => {
  const auth = WithAuthorization(["doctor"]);

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
      <div className="row">
        <div className="card-body pb-2 pt-0 ms-6">
          <div className="row">
            <div className="row mt-2 mb-4">
              <div className="col-12">
                <div className="card-body">
                  <p className="text-sm font-weight-bolder text-dark">
                    Rekam Medik
                  </p>
                  <div className="row">
                    <div className="col-3">
                      <p className="text-xs text-secondary font-weight-bold">
                        Nama Pasien
                      </p>
                    </div>
                    <div className="col-4">
                      <p className="text-xs text-primary font-weight-bold">
                        {data.fullname}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <p className="text-xs text-secondary font-weight-bold">
                        Tanggal Verifikasi
                      </p>
                    </div>
                    <div className="col-4">
                      <p className="text-xs text-primary font-weight-bold">
                        {data.panoramik_check_date !== null
                          ? moment(data.panoramik_check_date).format(
                              "DD/MM/YYYY"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <p className="text-xs text-secondary font-weight-bold">
                        Dokter Verifikator
                      </p>
                    </div>
                    <div className="col-4">
                      <p className="text-xs text-primary font-weight-bold">
                        {data.doctor_name ?? "-"}
                      </p>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      <p className="text-xxs text-secondary font-weight-bold">
                        Radiodiagnosis Sistem
                      </p>
                      {data.diagnoses?.map((diagnose) => {
                        if (diagnose?.system_diagnosis) {
                          return (
                            <div className="row">
                              <div className="col-2">
                                <ul className="ps-3">
                                  <li className="text-xs">
                                    Gigi #{diagnose?.tooth_number}
                                  </li>
                                </ul>
                              </div>
                              <div className="col-10 ps-0">
                                <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                  {diagnose?.system_diagnosis}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <p className="text-xxs text-secondary font-weight-bold">
                        Radiodiagnosis Verifikator
                      </p>
                      {data.diagnoses?.map((diagnose) => {
                        if (
                          diagnose?.system_diagnosis ||
                          diagnose?.manual_diagnosis
                        ) {
                          return (
                            <div className="row">
                              <div className="col-2">
                                <ul className="ps-3">
                                  <li className="text-xs">
                                    Gigi #{diagnose?.tooth_number}
                                  </li>
                                </ul>
                              </div>
                              <div className="col-10 ps-0">
                                {diagnose.verificator_diagnosis ? (
                                  <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                    {diagnose.verificator_diagnosis ===
                                    "dan lain-lain"
                                      ? diagnose.verificator_note +
                                        (diagnose.manual_diagnosis
                                          ? ", " + diagnose.manual_diagnosis
                                          : "")
                                      : diagnose.verificator_diagnosis
                                      ? diagnose.verificator_diagnosis +
                                        (diagnose.manual_diagnosis
                                          ? ", " + diagnose.manual_diagnosis
                                          : "")
                                      : diagnose.manual_diagnosis}
                                  </p>
                                ) : (
                                  <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                    {diagnose.system_diagnosis
                                      ? diagnose.system_diagnosis +
                                        (diagnose.manual_diagnosis
                                          ? ", " + diagnose.manual_diagnosis
                                          : "")
                                      : diagnose.manual_diagnosis}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
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
