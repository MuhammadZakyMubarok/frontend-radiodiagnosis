import axios from "axios";
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";

const UploadUlangGambarPanoramik = () => {
  const auth = WithAuthorization(["radiographer"]);

  const [data, setData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleUploadImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("panoramikPicture", selectedFile);

    axios
      .put(`${baseURL}/radiographics/edit/${id}/picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSelectedFile(null);
        window.location.href = "/radiografer-radiografi-panoramik";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if(auth) {
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
              <div className="row mb-4 h-100">
                <div className="col-12">
                  <div className="card mb-4 h-100">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-6 d-flex align-items-center">
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
                      <div className="row mt-3">
                        <div className="col-3">
                          <p className="text-xs text-secondary mb-0">
                            Kode Pasien
                          </p>
                          <p className="text-xs font-weight-bolder mb-0">
                            {data.medic_number}
                          </p>
                        </div>
                        <div className="col-3">
                          <p className="text-xs text-secondary mb-0">
                            Nama Pasien
                          </p>
                          <p className="text-xs font-weight-bolder mb-0">
                            {data.fullname}
                          </p>
                        </div>
                        <div class="col-3">
                          <p class="text-xs text-secondary mb-0">Radiografer</p>
                          <p class="text-xs font-weight-bolder mb-0">
                            {data.radiographer_name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr
                      style={{
                        height: "1px",
                        borderWidth: "0px",
                        color: "gray",
                        backgroundColor: "gray",
                        marginBottom: "0px",
                        marginTop: "0px",
                      }}
                    />
  
                    <div className="card-body px-0 pb-2 pt-0">
                      <div className="row justify-content-center">
                        <div className="col-md-6">
                          <div className="card-header pb-0">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-3 font-weight-bolder">
                                Uggah Ulang Gambar
                                <br />
                                Radiografi Panoramik.
                              </h6>
                            </div>
                            <form onSubmit={handleUploadImage}>
                              <div
                                className="d-flex justify-content-center"
                                style={{ height: "15rem" }}
                              >
                                <div
                                  className="card shadow-none"
                                  style={{
                                    width: "35rem",
                                    height: "12rem",
                                    border: "2px dashed gainsboro",
                                    backgroundColor: "ghostwhite",
                                  }}
                                >
                                  <div className="d-flex justify-content-center mt-6 pt-2">
                                    <div>
                                      <img src="../assets/img/App/add_photo.png" />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                      {/* <p className="text-sm text-black mb-0">
                                      Klik untuk Menambahkan Gambar
                                    </p> */}
  
                                      <input
                                        class="form-control"
                                        type="file"
                                        name="image"
                                        onChange={(e) =>
                                          setSelectedFile(e.target.files[0])
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-end mb-6">
                                <button
                                  type="submit"
                                  className="btn btn-primary btn-sm"
                                >
                                  Unggah Gambar
                                </button>
                              </div>
                            </form>
                          </div>
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
  } else {
    return <div></div>
  }
};

export default UploadUlangGambarPanoramik;
