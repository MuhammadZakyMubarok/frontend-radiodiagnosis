import React from "react";

const VerifiedNo = () => {
  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal2"
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
              <p className="ms-2 pt-0 mt-0 mb-0 font-weight-bold text-dark ">
                Verifikasi Diagnosa
              </p>

              <p className="text-secondary text-xs ms-2 mt-2">
                Radiodiagnosis Sistem
              </p>
              <div className="row">
                <div className="col-3">
                  <p className="text-xs text-dark ps-2">Gigi #11</p>
                </div>
                <div className="col-4 ps-0">
                  <ul>
                    <li className="text-xs text-warning font-weight-bold">
                      Karies Gigi
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
                <div className="col">
                  <p className="text-dark text-xs ms-2 mt-1">
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
                      id="btnradio3"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className="btn btn-sm btn-outline-primary  mb-0 p-2 ps-3 pe-3 border-radius-xl mt-1"
                      htmlFor="btnradio3"
                    >
                      Ya
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnradio2"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-sm btn-outline-primary mt-1 mb-0 p-2 border-radius-xl"
                      htmlFor="btnradio2"
                    >
                      Tidak
                    </label>
                  </div>
                </div>

                <p className="text-secondary text-xs ms-2 mt-0 mb-2">
                  Radiodiagnosis Verifikator
                </p>
                <select
                  className="form-select ms-3 mb-3 text-xs"
                  style={{ width: "92%" }}
                  id="exampleFormControlSelect1"
                  aria-placeholder="xsaas"
                >
                  <option value='karises'>Karies</option>
                  <option value='lesi periapikal'>Lesi Periapikal</option>
                  <option value='impaksi'>Impaksi</option>
                  <option value='resorbsi'>Resorbsi</option>
                  <option value='lain-lain'>dll</option>
                </select>

                <p className="text-secondary text-xs ms-2 mt-0 mb-2">Catatan</p>
                <textarea
                  className="form-control ms-3 text-xs"
                  style={{ width: "92%" }}
                  type="text"
                  placeholder="Masukkan catatan pasien"
                ></textarea>
              </div>

              <div className="ms-auto text-end mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm mb-0 p-1"
                  data-bs-dismiss="modal"
                >
                  Batalkan
                </button>&nbsp;
                <button className="btn btn-primary btn-sm mb-0 pe-2 ps-2 pt-1 pb-1">
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedNo;
