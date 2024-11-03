import React from "react";

const ConfirmModal = ({ patientId, statusUser, onConfirm, onClose}) => {
  return (
    <div>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`confirmModal${patientId}`}
        tabIndex="-1"
        aria-labelledby="confirmModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-start">
              <img
                src="../assets/img/App/confirm.png" // ganti ikon sesuai kebutuhan
                className="navbar-brand-img h-100"
                alt=""
              />
              <p className="ms-5 pt-0 mt-0 mb-0 font-weight-bold">
                Anda akan mengubah status
                <br />
                Akun ini.
              </p>

              <p className="text-secondary text-sm ms-5">
                Apakah anda yakin ingin {statusUser === 0 ? "Acc" : "selesai"} akun ini? <br />
                Perubahan status tidak dapat dikembalikan.
              </p>
              <div className="ms-auto text-end">
                <button
                  type="button"
                  className="btn btn-success btn-sm px-3 mb-0"
                  onClick={() => onConfirm(patientId, statusUser)}
                >
                  Konfirmasi
                </button>
                &nbsp;
                <button
                  className="btn btn-outline-secondary btn-sm text-dark px-3 mb-0"
                  data-bs-dismiss="modal"
                  onClick={onClose}
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
