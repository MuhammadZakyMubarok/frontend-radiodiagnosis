import React from "react";

const ApproveModal = ({ userId, handleApprove, onClose }) => {
  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade show"
        id={`approveModal${userId}`}
        tabIndex="-1"
        aria-labelledby="approveModalLabel"
        aria-hidden="true"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} // Menambahkan background semi-transparan
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <p className="text-success font-weight-bold mb-1 mt-2">
                Persetujuan Data
              </p>
              <p className="text-secondary text-sm">
                Apakah Anda yakin ingin menyetujui data ini? <br />
                Data yang telah disetujui akan diproses lebih lanjut.
              </p>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-success btn-sm px-3 mb-0"
                  onClick={(e) => handleApprove(e, userId)} // Menambahkan userId agar proses persetujuan spesifik pada user
                >
                  Setujui
                </button>
                &nbsp;
                <button
                  className="btn btn-outline-secondary btn-sm text-dark px-3 mb-0"
                  onClick={onClose} // Menutup modal ketika tombol "Batalkan" ditekan
                  data-bs-dismiss="modal"
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

export default ApproveModal;
