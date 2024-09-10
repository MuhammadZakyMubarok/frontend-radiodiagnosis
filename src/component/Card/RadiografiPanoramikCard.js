import moment from "moment/moment";
import React from "react";
import Verified from "../Alerts/Verified";
import Unverified from "../Alerts/Unverified";
import { Link } from "react-router-dom";
import { baseURL } from "../../routes/Config";

const RadiografiPanoramikCard = ({ data }) => {
  return (
    <div>
      <div className="row p-3 ">
        {/* <div className="col-xl-4 col-sm-6 mb-xl-0 mb-4"> */}
        <div className="card p-3 mb-4 border-1">
          <div className="align-middle text-start text-sm ps-2">
            <span className="badge border-radius-xl text-dark badge-sm bg-gradient-faded-primary-vertical">
              Kode RM <span>{data.medic_number}</span>
            </span>
          </div>
          <img
            className=" border-radius-xl p-2"
            src={`${baseURL + data.panoramik_picture}`}
          />
          <div className="card-body p-2">
            <p className="text-sm text-dark font-weight-bolder mb-1">
              {data.fullname}
            </p>
            <div className="d-flex flex-column">
              <span className="mb-2 text-xs text-secondary">
                Tgl Upload Gambar
                <span className="text-primary text-xs ms-sm-4">
                  {moment(data.panoramik_upload_date).format("DD/MM/YYYY")}
                </span>
              </span>
            </div>
            <div className="d-flex flex-column">
              <span className="mb-2 text-xs text-secondary">
                Dokter Verifikator
                <span className="text-primary text-xs ms-4 ps-2">
                  {data.doctor_name ?? "-"}
                </span>
              </span>
            </div>
            <p className="text-xs text-secondary mt-4">Radiodiagnosis Sistem</p>
            {data.diagnoses?.map((diagnose) => {
                if (diagnose?.system_diagnosis) {
                  return (
                    <div className="row">
                      <div className="col-4">
                        <ul className="ps-3">
                          <li className="text-sm">
                            Gigi #{diagnose?.tooth_number}
                          </li>
                        </ul>
                      </div>
                      <div className="col-8 ps-0">
                        <p className="text-sm text-dark font-weight-bolder">
                          {diagnose?.system_diagnosis}
                        </p>
                      </div>
                    </div>
                  );
                }
              })}

            <div className="row mt-4">
              <div className="col-6 pe-0">
                {data.panoramik_check_date === null ? (
                  <Unverified />
                ) : (
                  <Verified />
                )}
              </div>

              <div className="col-6 pe-2 text-end">
                <Link
                  to={`/radiografer-view-gambar-panoramik/${data.history_id}`}
                >
                  <button
                    type="button"
                    className="text-dark btn btn-outline-secondary btn-sm p-1 px-2 opacity-5 mb-0"
                  >
                    Lihat Detail
                  </button>{" "}
                </Link>
              </div>
              {/* <div className="col-2 ps-0">
                <button className="btn btn-outline-secondary btn-sm px-3 py-1 text-dark opacity-5 mb-0">
                  <i className="fa fa-ellipsis-v text-xs"></i>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiografiPanoramikCard;
