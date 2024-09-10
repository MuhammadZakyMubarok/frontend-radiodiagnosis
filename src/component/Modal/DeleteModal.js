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
            <div className="modal-body text-start">
              <img
                src="../assets/img/App/delete.png"
                className="navbar-brand-img h-100"
                alt=""
              />
              <p className="ms-5 pt-0 mt-0 mb-0 font-weight-bold">
                Anda akan menghapus
                <br />
                Data ini.
              </p>

              <p className="text-secondary text-sm ms-5">
                Apakah anda yakin akan menghapus data ini? <br />
                Data yang telah dihapus tidak akan dikembalikan lagi.
              </p>
              <div className="ms-auto text-end">
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
