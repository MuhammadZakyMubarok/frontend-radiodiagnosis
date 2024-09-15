import axios from "axios";
import { React, useState } from "react";
import { baseURL } from "../../routes/Config";

const InterpretasiManual = ({ radiographicId }) => {
  const [data, setData] = useState({
    toothNumber: "",
    manualDiagnosis: "",
  });
  
  const [error, setError] = useState(""); // State untuk menampung pesan error
  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parsing data untuk memastikan tipe datanya benar
    const parsedData = {
      toothNumber: parseInt(data.toothNumber, 10), // Mengonversi nomor gigi ke number jika perlu
      manualDiagnosis: data.manualDiagnosis.trim(), // Menghapus spasi ekstra
    };

    // Cek apakah token valid
    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    // Logging data yang akan dikirim untuk debugging
    console.log("Data yang dikirim: ", parsedData);

    // Membuat request ke API
    axios
      .post(`${baseURL}/diagnoses/${radiographicId}/manual`, parsedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        // Menangkap error lebih detail dari respons server
        if (err.response) {
          console.log("Response data:", err.response.data);
          console.log("Response status:", err.response.status);
          console.log("Response headers:", err.response.headers);

          // Menangkap error jika ada masalah SQL seperti 'syntax error at or near "WHERE"'
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Gagal mengirim data'}`);
        } else if (err.request) {
          console.log("Request:", err.request);
          setError("Tidak ada respons dari server. Periksa koneksi internet Anda.");
        } else {
          console.log("Error message:", err.message);
          setError("Terjadi kesalahan: " + err.message);
        }
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

              {/* Menampilkan pesan error jika ada */}
              {error && <p className="text-danger">{error}</p>}

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
