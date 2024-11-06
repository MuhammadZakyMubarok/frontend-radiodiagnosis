import axios from "axios";
import { React, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import DeleteModal from "../../../component/Modal/DeleteModal";
import ApproveModal from "../../../component/Modal/ApproveModal";
import CancelModal from "../../../component/Modal/CancelModal";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import "../../Responsive/responsive.css";
import PatientService from "../../../api/satu-sehat/patient.service";

const AlertMessage = ({ message, status, progress }) => {
  const getAlertClass = () => {
    switch (status) {
      case "success":
        return "alert alert-success fade show";
      case "loading":
        return "alert alert-warning fade show";
      case "error":
        return "alert alert-danger fade show";
      default:
        return "alert alert-secondary fade show";
    }
  };

  return (
      <div className={`${getAlertClass()} py-2 px-3`} role="alert">
        {status === "loading" && (
            <div className="progress mt-2" style={{ height: "5px" }}>
              <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
              ></div>
            </div>
        )}
        {message}
      </div>
  );
};


const ViewDataPasien = () => {
  const auth = WithAuthorization(["radiographer"]);

  const [data, setData] = useState({});
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Satu sehat
  const [satuSehatResponse, setSatuSehatResponse] = useState("");
  const [satuSehatResponseProgress, setSatuSehatResponseProgress] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Logic progress bar biar bisa jalan
  useEffect(() => {
    let interval;
    if (satuSehatResponse === "loading") {
      interval = setInterval(() => {
        setSatuSehatResponseProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);
    } else {
      setSatuSehatResponseProgress(0);
    }
    return () => clearInterval(interval);
  }, [satuSehatResponse]);

  // get data user use axios
  useEffect(() => {
    axios
      .get(`${baseURL}/patients/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`${baseURL}/patients/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.href = "/radiografer-data-pasien";
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleApprove = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate("/radiografer-data-pasien"); // Navigasi setelah berhasil disetujui
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate("/radiografer-data-pasien"); // Navigasi setelah berhasil disetujui
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
  };
  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  // Fungsi untuk membuka modal persetujuan
  const openApproveModal = () => {
    setShowApproveModal(true);
  };
  const closeApproveModal = () => {
    setShowApproveModal(false);
  };

  // Fungsi handle satu sehat
  const handleCheckDataSatuSehat = async () => {
    setSatuSehatResponse("loading");

    const patientService = PatientService();
    try {
      const response = await patientService.searchNIK({ nik: data.id_number });
      if (response.data) {
        setSatuSehatResponse("success");
      } else {
        setSatuSehatResponse("error");
      }
    } catch (err) {
      setSatuSehatResponse("error");
    }
  };

  if (auth) {
    return (
      <div>
        <body className="g-sidenav-show bg-gray-100">
          <div className="min-height-300 bg-primary position-absolute w-100"></div>
          <aside
            className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
            id="sidenav-main"
          >
            <SidebarRadiografer />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            <HeaderDataUser />
            <div className="container-fluid py-2">
              <div className="row p-0">
                <div className="col-12">
                  <div className="card mb-4" id="card-l">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-6 d-flex align-items-center">
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/radiografer-data-pasien"
                          >
                            <i
                              className="fa fa-arrow-left"
                              aria-hidden="true"
                            ></i>
                            &nbsp;&nbsp;Kembali
                          </a>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-5 col-md-12 ms-auto d-flex justify-content-end" id="btn-dlt-edt-cek">
                          <div className="col-4">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-primary"
                              data-bs-toggle="modal"
                              data-bs-target={``}
                              onClick={handleCheckDataSatuSehat}
                            >
                              <i className="fas fa-file-medical text-primary"></i>
                              &nbsp;&nbsp; Cek Data Satu Sehat
                            </button>
                          </div>
                          <div className="col-4">
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-danger"
                            >
                              <Link
                                to={`/radiografer-edit-data-pasien/${id}`}
                              >
                                <i className="fa fa-pencil text-success "></i>
                                &nbsp;&nbsp; Edit Data Pasien
                              </Link>
                            </button>
                          </div>
                          <div className="col-4">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-danger"
                              data-bs-toggle="modal"
                              data-bs-target={`#exampleModal4{id}`}
                            >
                              <i className="fa fa-trash text-danger"></i>
                              &nbsp;&nbsp; Hapus Data Pasien
                            </button>
                            <DeleteModal
                              userId={id}
                              handleDelete={handleDelete}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body px-0 pb-2 pt-0">
                      <div className="row justify-content-center">
                        <div className="col-md-6 me-lg-8 me-auto" id="form-detail-rdg">
                          <div className="card shadow-none border-0">
                            <div className="card-header pb-0">
                              <div className="d-flex align-items-center">
                                <h5 className="mb-0 font-weight-bolder">
                                  Data Pasien
                                </h5>
                              </div>
                            </div>

                            <div className="card-body pt-3">
                              <div className="row">
                                <div className="col">
                                  <div className="form-group">
                                    <label
                                      htmlFor="example-text-input"
                                      className="form-control-label"
                                    >
                                      Nama Lengkap
                                    </label>
                                    <p className="form-control" type="text">
                                      {data.fullname}
                                    </p>
                                  </div>
                                  <div className="row-cols-md-3">
                                    <div className="form-group">
                                      <label
                                        htmlFor="example-text-input"
                                        className="form-control-label"
                                      >
                                        Nomor Rekam Medik
                                      </label>
                                      <p className="form-control" type="text">
                                        {data.medic_number}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label
                                        htmlFor="example-text-input"
                                        className="form-control-label"
                                    >
                                      NIK (Nomor Induk Kewarganegaraan)
                                    </label>
                                    <p className="form-control" type="text">
                                      {data.id_number}
                                    </p>


                                    {satuSehatResponse === "loading" && (
                                        <AlertMessage
                                            message="Proses pengecekan ke satu sehat"
                                            status="loading"
                                            progress={satuSehatResponseProgress}
                                        />
                                    )}
                                    {satuSehatResponse === "success" && (
                                        <AlertMessage
                                            message="NIK telah terdaftar di satu sehat"
                                            status="success"
                                        />
                                    )}
                                    {satuSehatResponse === "error" && (
                                        <AlertMessage
                                            message="NIK tidak terdaftar di satu sehat"
                                            status="error"
                                        />
                                    )}

                                  </div>

                                  <div className="row">
                                    <label
                                        htmlFor="example-text-input"
                                        className="form-control-label"
                                    >
                                      Jenis Kelamin
                                    </label>
                                  </div>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="options-outlined"
                                    id="Laki-Laki"
                                    autocomplete="off"
                                    checked={data.gender === "Laki-Laki"}
                                    disabled
                                  />
                                  <label
                                    className="btn btn-outline-primary btn-sm"
                                    htmlFor="Laki-Laki"
                                  >
                                    Laki-Laki
                                  </label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="options-outlined"
                                    id="Perempuan"
                                    autocomplete="off"
                                    checked={data.gender === "Perempuan"}
                                    disabled
                                  />
                                  <label
                                    className="btn btn-outline-secondary btn-sm"
                                    htmlFor="Perempuan"
                                  >
                                    Perempuan
                                  </label>

                                  <div className="row-cols-md-3">
                                    <div className="form-group">
                                      <label
                                        htmlFor="exampleFormControlSelect1"
                                        className="form-control-label"
                                      >
                                        Agama
                                      </label>
                                      <p className="form-control" type="text">
                                        {data.religion}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label
                                      htmlFor="example-text-input"
                                      className="form-control-label"
                                    >
                                      Alamat
                                    </label>
                                    <p className="form-control" type="text">
                                      {data.address}
                                    </p>
                                  </div>

                                  <label
                                    htmlFor="example-text-input"
                                    className="form-control-label"
                                  >
                                    Tempat Tanggal Lahir
                                  </label>

                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <p className="form-control" type="text">
                                          {data.born_location}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <p className="form-control" type="text">
                                          {data.born_date}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <label
                                    htmlFor="example-text-input"
                                    className="form-control-label"
                                  >
                                    Umur Pasien
                                  </label>
                                  <div className="row">
                                    <div className="col-md-3">
                                      <div className="form-group">
                                        <p className="form-control" type="text">
                                          {data.age}
                                        </p>
                                      </div>
                                    </div>
                                    {/* <div className="col-md-3">
                                      <div className="form-group">
                                        <p className="form-control" type="text">
                                          3
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="form-group">
                                        <p className="form-control" type="text">
                                          14
                                        </p>
                                      </div>
                                    </div> */}
                                  </div>

                                  <div className="form-group">
                                    <label
                                      htmlFor="example-text-input"
                                      className="form-control-label"
                                    >
                                      Nomor Telepon
                                    </label>
                                    <p className="form-control" type="text">
                                      {data.phone_number}
                                    </p>
                                  </div>

                                  <div className="form-group">
                                    <label
                                      htmlFor="exampleFormControlSelect1"
                                      className="form-control-label"
                                    >
                                      Asal Rujukan
                                    </label>
                                    <p className="form-control" type="text">
                                      {data.referral_origin}
                                    </p>
                                  </div>
                                  <hr className="horizontal dark" />
                                  <p className=" text-sm text-uppercase">
                                    Data Radiografer
                                  </p>
                                  <div className="form-group">
                                    <label
                                      htmlFor="exampleFormControlSelect1"
                                      className="form-control-label"
                                    >
                                      Pilih Radiografer
                                    </label>
                                    <p className="form-control" type="text">
                                      {data.radiographer}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-end ms-auto">
                        <div className="col-md-2 col-12 d-flex flex-column justify-content-center text-center">
                          <div className="w-100" >
                            <button
                              className="btn bg-gradient-primary btn-sm mb-2 border-radius-xl w-100"
                              onClick={openApproveModal}
                            >
                              Setujui
                            </button>
                          </div>
                        </div>

                        <div className="col-md-2 col-12 d-flex flex-column justify-content-center text-center">
                          <div className="w-100">
                            <button
                              className="btn btn-sm border border-danger border-radius-xl w-100 text-danger"
                              onClick={openCancelModal}
                            >
                              Batal
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {/* Approve Confirmation Modal */}
              {showApproveModal && (
                <ApproveModal
                  userId={id}
                  handleApprove={handleApprove}
                  onClose={closeApproveModal}
                />
              )}
              {showCancelModal && (
                <CancelModal
                  userId={id}
                  handleCancel={handleCancel}
                  onClose={closeCancelModal}
                />
              )}
            </div>
          </main>
        </body>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ViewDataPasien;
