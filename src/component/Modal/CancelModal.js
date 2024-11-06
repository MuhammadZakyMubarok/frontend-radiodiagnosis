import React from "react";

const CancelModal = ({ userId, handleCancel, onClose }) => {
  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade show"
        id={`CancelModal${userId}`}
        tabIndex="-1"
        aria-labelledby="CancelModalLabel"
        aria-hidden="true"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} // Menambahkan background semi-transparan
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <p className="text-danger font-weight-bold mb-1 mt-2">
                Persetujuan Data
              </p>
              <p className="text-secondary text-sm">
                Apakah Anda yakin ingin membatalkan data ini? <br />
                Data yang telah dibatalkan tidak akan diproses lebih lanjut.
              </p>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-3 mb-0"
                  onClick={(e) => handleCancel(e, userId)} // Menambahkan userId agar proses persetujuan spesifik pada user
                >
                  Batalkan
                </button>
                &nbsp;
                <button
                  className="btn btn-outline-secondary btn-sm text-dark px-3 mb-0"
                  onClick={onClose} // Menutup modal ketika tombol "Batalkan" ditekan
                  data-bs-dismiss="modal"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
