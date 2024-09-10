import axios from "axios";
import { React, useState } from "react";
import VerifiedYes from "./VerifiedYes";

const VerifiedResult = ({ index, diagnose }) => {
  // const [data, setData] = useState();

  // const handleChange = (e) => {
  //   setData({
  //     ...data,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  return (
    <div
      className="modal fade"
      id={`exampleModalResult${index}`}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ width: "30%" }}
      >
        <div className="modal-content">
          <div className="modal-body">
            <div className="row">
              <div className="col-6">
                <p className="ms-2 pt-0 mt-0 mb-0 font-weight-bold text-dark ">
                  Verifikasi Diagnosa
                </p>
              </div>
              <div className="col-6 pe-0 text-end">
                {/* <button
                    type="button"
                    className="btn btn-link text-xs text-end pt-2 mb-0 pe-3 text-"
                  >
                    Edit
                  </button> */}
                <button
                  type="button"
                  className="btn btn-link text-xs text-end pt-2 mb-0 ps-0 text-primary"
                  data-bs-target={`#exampleModal${index}`}
                  data-bs-toggle="modal"
                >
                  Edit Data
                </button>
              </div>
            </div>

            <p className="mt-2 ms-2 mb-0 badge border-radius-xl text-xs  badge-sm bg-gradient-faded-success-vertical">
              <i className="fa fa-check"></i>&nbsp; Telah Diverifikasi
            </p>

            <p className="text-secondary text-xs ms-2 mt-2">
              Radiodiagnosis Sistem
            </p>
            <div className="row">
              <div className="col-3">
                <p className="text-xs text-dark ps-2">
                  Gigi #{diagnose?.tooth_number}
                </p>
              </div>
              <div className="col-4 ps-0">
                <ul>
                  <li className="text-xs text-warning font-weight-bold">
                    {diagnose?.system_diagnosis}
                  </li>
                </ul>
              </div>
              <hr
                style={{
                  height: "1px",
                  borderWidth: "0px",
                  color: "gray",
                  backgroundColor: "gray",
                  marginBottom: "2px",
                }}
              />
            </div>
            <div className="row">
              <p className="text-secondary text-xs ms-2 mt-2 mb-2">
                Radiodiagnosis Verifikator
              </p>
              <div className="col-3">
                <p className="text-xs text-dark ps-2">
                  Gigi #{diagnose?.tooth_number}
                </p>
              </div>
              <div className="col-4 ps-0">
                <ul>
                  <li
                    className="text-xs text-warning font-weight-bold"
                    type="input"
                  >
                    {diagnose.verificator_diagnosis != ""
                      ? diagnose.verificator_diagnosis
                      : diagnose.system_diagnosis}
                  </li>
                  {/* <li className="text-xs text-warning font-weight-bold">
                    <input className="text-xs text-warning font-weight-bold border-none" value={diagnose.verificator_diagnosis != ""
                        ? diagnose.verificator_diagnosis
                        : diagnose.system_diagnosis} name="diagnose" type="text" onChange={handleChange}/>
                    </li> */}
                </ul>
              </div>
              <hr
                style={{
                  height: "1px",
                  borderWidth: "0px",
                  color: "gray",
                  backgroundColor: "gray",
                  marginBottom: "2px",
                }}
              />
              <p className="text-secondary text-xs ms-2 mt-2 mb-2">Catatan</p>
              <p className="text-xs text-dark ms-2">
                {diagnose.verificator_note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedResult;
