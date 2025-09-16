import axios from "axios";
import moment from "moment";
import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import DeleteModal from "../../../component/Modal/DeleteModal";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import StatusUnverified from "../../../component/Alerts/StatusUnverified";
import "../../Responsive/responsive.css";

const ViewGambarPanoramik = () => {
  const auth = WithAuthorization(["radiographer"]);
  const [data, setData] = useState({});
  const [teethNumber, setTeethNumber] = useState([]);

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${baseURL}/radiographics/detail/${id}`, {
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
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    let numbers = [];
    data.diagnoses?.map((diagnose) => {
      numbers.push(diagnose?.tooth_number);
    });
    setTeethNumber(numbers);
    console.log('data', data)
  }, [data]);

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`${baseURL}/radiographics/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.href = "/radiografer-radiografi-panoramik";
      })
      .catch((error) => {
        console.log(error);
      });
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
                        <div className="col-8 d-flex align-items-center mb-4">
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/radiografer-radiografi-panoramik"
                          >
                            <i
                              className="fa fa-arrow-left"
                              aria-hidden="true"
                            ></i>
                            &nbsp;&nbsp;Kembali
                          </a>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-8 col-12 mb-2 mb-md-0">
                          <h6 className="mb-0 font-weight-bolder">
                            Verifikasi Gambar Radiografi Panoramik
                          </h6>
                        </div>
                        <div className="col-md-2 col-12 d-flex flex-column justify-content-center text-center" id="btn-reupload">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-danger" 
                          >
                            <Link
                              to={`/radiografer-upload-ulang-gambar-panoramik/${id}`}
                            >
                              <i className="fa fa-cloud-upload text-primary"></i>
                              &nbsp;&nbsp; Unggah Ulang Gambar
                            </Link>
                          </button>
                        </div>
                        <div className="col-md-2 col-12 d-flex flex-column justify-content-center text-center">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-danger"
                            data-bs-toggle="modal"
                            data-bs-target={`#exampleModal${data.radiographics_id}`}
                          >
                            <i className="fa fa-trash text-danger"></i>
                            &nbsp;&nbsp; Hapus Gambar
                          </button>
                        </div>
                        <DeleteModal
                          userId={data.radiographics_id}
                          handleDelete={handleDelete}
                        />
                      </div>
                    </div>

                    <div className="card-body px-0 pb-2 pt-0 pe-3">
                      <div className="row">
                        <div className="col pe-0">
                          <div className="card-header pb-0 ps-0">
                            <div className="row mt-3">
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Kode Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.medic_number}
                                </p>
                              </div>
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Nama Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.fullname}
                                </p>
                              </div>
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Tanggal Periksa
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {moment(data.panoramik_upload_date).format(
                                    "DD/MM/YYYY"
                                  )}
                                </p>
                              </div>
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Status
                                </p>
                                <p className="text-xs font-weight-bolder mb-0 text-warning">
                                  {data.panoramik_check_date === null ? (
                                    <p className="text-xs font-weight-bolder mb-0">
                                      <StatusUnverified />
                                    </p>
                                  ) : (
                                    <p className="text-xs font-weight-bolder mb-0 text-success">
                                      Diverifikasi oleh {data.doctor_name}
                                    </p>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <hr
                            style={{
                              height: "1px",
                              borderWidth: "0 px",
                              color: "gray",
                              backgroundColor: "gray",
                              marginBottom: "0 px",
                            }}
                          />

                          <div className="card-body pb-2 pt-0">
                            <div className="row justify-content-center">
                              <div className="col-md-12">
                                <div
                                  className="card shadow-none mt-2"
                                  style={{ backgroundColor: "ghostwhite" }}
                                >
                                  <div className="row d-flex justify-content-center mt-4">
                                    <div className="col-8">
                                      <p className="text-xs p-2 mb-0">
                                        Gambar Panoramik Gigi
                                      </p>

                                      <img
                                        className="img-fluid border-radius-xl p-2"
                                        src={`${baseURL + data.panoramik_picture}`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Removed system detection code */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </body>
      </div>
    );
  }
};

export default ViewGambarPanoramik;
