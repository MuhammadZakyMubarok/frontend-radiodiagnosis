import React from "react";

const DeleteModal = ({ userId, handleDelete }) => {
  return (
    <div>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal${userId}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img
                src="../assets/img/App/delete.png"
                className="navbar-brand-img h-100 mx-auto d-block"
                alt=""
                style={{ width: "50px", marginBottom: "15px" }} // Atur ukuran dan margin bawah gambar
              />
              <p className="text-danger font-weight-bold mb-1">
                Hapus Data
              </p>
              <p className="text-secondary text-sm">
                Apakah anda yakin akan menghapus data ini? <br />
                Data yang telah dihapus tidak akan dikembalikan lagi.
              </p>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-3 mb-0"
                  onClick={(e) => handleDelete(e, userId)}
                >
                  Hapus Data
                </button>
                &nbsp;
                <button
                  className="btn btn-outline-secondary btn-sm text-dark px-3 mb-0"
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

export default DeleteModal;
