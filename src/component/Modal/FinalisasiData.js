import axios from "axios";
import { React, useState } from "react";
import { baseURL } from "../../routes/Config";
// import { useNavigate } from "react-router-dom";

const FinalisasiData = ({ radiographicId, catatanPasien }) => {
    // const navigate = useNavigate();
    const [error, setError] = useState(""); // State untuk menampung pesan error
    const token = sessionStorage.getItem("token");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Cek apakah token valid
        if (!token) {
            setError("Token tidak ditemukan. Silakan login ulang.");
            return;
        }

        // Membuat request ke API
        axios
            .put(
                `${baseURL}/radiographics/edit/${radiographicId}/catatan`,
                catatanPasien,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                console.log('Data finalized successfully:', res.data);
                window.location.href = "/dokter-radiografi-panoramik";
            })
            .catch((err) => {
                console.error('Error finalizing data:', err);
                setError("There was an error finalizing the data.");
            });

        axios
            .put(
                `${baseURL}/radiographics/edit/${radiographicId}/status`,
                2,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                console.log('Status set successfully:', res.data);
                window.location.href = "/dokter-radiografi-panoramik";
            })
            .catch((err) => {
                console.error('Error setting status:', err);
                setError("There was an error setting the status.");
            });

    };

    return (
        <div>
            <div
                className="modal fade"
                id="finalisasiModal"
                tabIndex="-1"
                // style={{ display: "block" }}
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
                                Finalisasi Data
                            </p>

                            <div className="row mt-2">
                                <div className="col-12">
                                    <p className="text-secondary text-xs ms-2 mt-3 mb-2">
                                        Apakah anda yakin ingin finalisasi data analisa ini?
                                    </p>
                                </div>
                            </div>

                            <div className="ms-auto text-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm mb-0 p-1"
                                    data-bs-dismiss="modal"
                                >
                                    Tidak
                                </button>
                                &nbsp;
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-outline-success btn-sm mb-0 pe-2 ps-2 pt-1 pb-1"
                                >
                                    Iya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalisasiData;
