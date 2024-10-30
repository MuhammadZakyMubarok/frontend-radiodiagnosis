import React from "react";

const OdontogramModal = ({ toothNumber }) => {
    return (
        <div>
            <div
                className="modal fade"
                id="odontogramModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-start">
                            <p className="ms-5 pt-0 mt-0 mb-0 font-weight-bold">Nomor Gigi: {toothNumber}</p>
                            <p className="text-secondary text-sm ms-5">
                                Informasi atau tindakan terkait gigi nomor {toothNumber}.
                            </p>
                            <div className="ms-auto text-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm text-dark px-3 mb-0"
                                    data-bs-dismiss="modal"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OdontogramModal;
