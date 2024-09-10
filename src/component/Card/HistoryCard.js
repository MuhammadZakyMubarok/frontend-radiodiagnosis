import moment from "moment";
import React from "react";
import { baseURL } from "../../routes/Config";
import Paginations from "../Pagination/Paginations";

const HistoryCard = ({ data }) => {
  return (
    <div>
      <div
        class="card shadow-none mt-2"
        style={{ backgroundColor: "ghostwhite" }}
      >
        <div class="row d-flex justify-content-center mt-4 mb-4">
          <div class="col-8">
            <div class="card shadow-none mt-4 me-2 ms-2">
              <div class="card-body">
                <p class="text-sm font-weight-bolder text-dark">Histori#1</p>
                <p class="text-xs text-secondary font-weight-bold">
                  Gambar Panoramik Gigi
                </p>
                <img
                  className=" img-fluid ps-0 pb-4"
                  // style={{borderBottomLeftRadius:"1rem" }}
                  src={`${baseURL + data.panoramik_picture}`}
                />

                <div class="row">
                  <div class="col-3">
                    <p class="text-xs text-secondary font-weight-bold">
                      Tanggal Upload
                    </p>
                  </div>
                  <div class="col-4">
                    <p class="text-xs text-primary font-weight-bold">
                      {moment(data.panoramik_upload_date).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">
                    <p class="text-xs text-secondary font-weight-bold">
                      Radiografer
                    </p>
                  </div>
                  <div class="col-4">
                    <p class="text-xs text-primary font-weight-bold">
                      {data.radiographer_name ?? "-"}
                    </p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">
                    <p class="text-xs text-secondary font-weight-bold">
                      Dokter Verifikator
                    </p>
                  </div>
                  <div class="col-4">
                    <p class="text-xs text-primary font-weight-bold">
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
                              <hr
                                style={{
                                  height: "1px",
                                  borderWidth: "0 px",
                                  color: "gray",
                                  backgroundColor: "gray",
                                  marginBottom: "0 px",
                                  marginTop: "0 px",
                                }}
                              />
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
                              <hr
                                style={{
                                  height: "1px",
                                  borderWidth: "0 px",
                                  color: "gray",
                                  backgroundColor: "gray",
                                  marginBottom: "0 px",
                                  marginTop: "0 px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>

                {/* <div className="row">
                  <div className="col-12">
                    <p className="text-xxs text-secondary font-weight-bold">
                      Interpretasi Manual
                    </p>
                    {data.diagnoses?.map((diagnose) => {
                      if (diagnose?.manual_diagnosis) {
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
                                {diagnose?.manual_diagnosis}
                              </p>
                              <hr
                                style={{
                                  height: "1px",
                                  borderWidth: "0 px",
                                  color: "gray",
                                  backgroundColor: "gray",
                                  marginBottom: "0 px",
                                  marginTop: "0 px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
