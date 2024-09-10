import React from "react";
import VerifiedNo from "./VerifiedNo";
import axios from "axios";
import { baseURL } from "../../routes/Config";

const VerifiedYes = ({ index, diagnose, diagnoses, historyId }) => {
  console.log(diagnoses);
  const token = sessionStorage.getItem("token");

  const [show, setShow] = React.useState(false);
  const [data, setData] = React.useState({
    verificatorDiagnosis: "",
    verificatorNote: "",
    isCorrect: show ? 1 : 0,
  });

  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
    setData({
      ...data,
      isCorrect: 0,
    });
  };

  const handleYes = (e) => {
    e.preventDefault();
    setShow(false);
    setData({
      verificatorDiagnosis: "",
      verificatorNote: "",
      isCorrect: 1,
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    let count = 1;

    await Promise.all(
      diagnoses.map((dg) => {
        if (dg.verification_date) {
          count++;
        }
      })
    );

    console.log(count);
    console.log(diagnoses.length);

    if (count === diagnoses.length) {
      console.log("masuk update");
      try {
        await axios.get(`${baseURL}/radiographics/update/${historyId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await axios.post(
        `${baseURL}/diagnoses/${diagnose.id}/verificator`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    window.location.reload();
  }

  return (
    <div
      className="modal fade"
      id={`exampleModal${index}`}
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
            <p className="ms-2 pt-0 mt-0 mb-0 font-weight-bold text-dark text-start">
              Verifikasi Diagnosa
            </p>

            <p className="text-secondary text-xs ms-2 mt-2 text-start">
              Radiodiagnosis Sistem
            </p>
            <div className="row">
              <div className="col-3 text-start">
                <p className="text-xs text-dark ps-2">
                  Gigi #{diagnose?.tooth_number}
                </p>
              </div>
              <div className="col-4 text-start ps-0">
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
                  marginBottom: "2",
                }}
              />
            </div>
            <div className="row">
              <div className="col">
                <p className="text-dark text-start text-xs ms-2 mt-0">
                  Apakah hasil Diagnosa Sistem <br />
                  sudah sesuai?
                </p>
              </div>
              <div className="col">
                <div className="d-flex justify-content-end">
                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio1"
                    autoComplete="off"
                    checked={show ? false : true}
                  />
                  <label
                    className="btn btn-sm btn-outline-primary mt-0 mb-0 p-2 ps-3 pe-3 border-radius-xl"
                    htmlFor="btnradio1"
                    onClick={handleYes}
                  >
                    Ya
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio2"
                    autoComplete="off"
                    checked={show ? true : false}
                  />
                  <label
                    className="btn btn-sm btn-outline-primary mt-0 mb-0 p-2 border-radius-xl"
                    htmlFor="btnradio2"
                    onClick={handleShow}
                  >
                    Tidak
                  </label>
                </div>
              </div>
              {show ? (
                <div>
                  <p className="text-secondary text-xs ms-2 mt-0 mb-2">
                    Radiodiagnosis Verifikator
                  </p>
                  <select
                    className="form-select ms-3 mb-3 text-xs"
                    style={{ width: "92%" }}
                    id="exampleFormControlSelect1"
                    aria-placeholder="xsaas"
                    name="verificatorDiagnosis"
                    onChange={(e) => handleChange(e)}
                    value={data.verificatorDiagnosis}
                  >
                    <option value="Karises">Karies</option>
                    <option value="Lesi Periapikal">Lesi Periapikal</option>
                    <option value="Impaksi">Impaksi</option>
                    <option value="Resorbsi">Resorbsi</option>
                    <option value="dan lain-lain">dan lain-lain</option>
                  </select>

                  <p className="text-secondary text-xs ms-2 mt-0 mb-2">
                    Catatan
                  </p>
                  <textarea
                    className="form-control ms-3 text-xs"
                    style={{ width: "92%" }}
                    type="text"
                    placeholder="Masukkan catatan pasien"
                    name="verificatorNote"
                    onChange={(e) => handleChange(e)}
                  >
                    {diagnose.verificator_note}
                  </textarea>
                </div>
              ) : (
                ""
              )}
              <hr
                style={{
                  height: "1px",
                  borderWidth: "0px",
                  color: "gray",
                  backgroundColor: "gray",
                  marginBottom: "2",
                }}
              />
            </div>

            <div className="ms-auto text-end mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mb-0 p-1"
                onClick={(e) => handleClose(e)}
              >
                Batalkan
              </button>
              &nbsp;
              <button
                className="btn btn-primary btn-sm mb-0 pe-2 ps-2 pt-1 pb-1"
                onClick={(e) => handleSubmit(e)}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedYes;
