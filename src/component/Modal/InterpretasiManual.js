import axios from "axios";
import { React, useState } from "react";
import { baseURL } from "../../routes/Config";

const InterpretasiManual = ({ radiographicId }) => {
  const [data, setData] = useState({
    toothNumber: "",
    manualDiagnosis: "",
  });

  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/diagnoses/${radiographicId}/manual`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal3"
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
              <p className="ms-2 pt-0 mt-0 mb-0 font-weight-bold text-dark">
                Interpretasi Manual
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row mt-2">
                  <div className="col-3">
                    <p className="text-secondary text-xs ms-2 mt-0 mb-2">
                      No.Gigi
                    </p>
                    <input
                      className="form-control ms-2 mb-3 text-xs"
                      style={{ width: "92%" }}
                      id="toothNumber"
                      name="toothNumber"
                      placeholder="no.gigi"
                      value={data.toothNumber}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="col-9">
                    <p className="text-secondary text-xs ms-2 mt-0 mb-2">
                      Tulis Diagnosa
                    </p>
                    <input
                      className="ms-2 mb-3 text-xs form-control"
                      style={{ width: "95%" }}
                      placeholder="tulis nama penyakit"
                      name="manualDiagnosis"
                      value={data.manualDiagnosis}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </div>

                <div className="ms-auto text-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mb-0 p-1"
                    data-bs-dismiss="modal"
                  >
                    Batalkan
                  </button>{" "}
                  &nbsp;
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm mb-0 pe-2 ps-2 pt-1 pb-1"
                  >
                    Selesai
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterpretasiManual;
