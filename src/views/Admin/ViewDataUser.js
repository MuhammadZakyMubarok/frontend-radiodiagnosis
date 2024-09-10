import axios from "axios";
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderAdmin from "../../component/Header/HeaderAdmin";
import SidebarAdmin from "../../component/Sidebar/SidebarAdmin";
import { baseURL } from "../../routes/Config";
import WithAuthorization from "../../utils/auth";

export const ViewDataUser = (props) => {
  const auth = WithAuthorization(["admin"]);

  const [data, setData] = useState({});

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  // get data user use axios
  useEffect(() => {
    axios
      .get(`${baseURL}/users/profile/${id}`, {
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

  if(auth) {
    return (
      <div>
        <body className="g-sidenav-show bg-gray-100">
          <div className="min-height-300 bg-primary position-absolute w-100"></div>
          <aside
            className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
            id="sidenav-main"
          >
            <SidebarAdmin />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            <HeaderAdmin />
            <div className="container-fluid py-2">
              <div className="row p-0">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-6 d-flex align-items-center">
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/data-user"
                          >
                            <i
                              className="fa fa-arrow-left"
                              aria-hidden="true"
                            ></i>
                            &nbsp;&nbsp;Kembali
                          </a>
                        </div>
                      </div>
                    </div>
  
                    <div className="card-body px-0 pb-2 pt-0">
                      <div className="row justify-content-center">
                        <div className="col-md-6">
                          <div className="card shadow-none border-0">
                            <div className="card-header pb-0">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 font-weight-bolder">
                                  Data User
                                </h6>
                              </div>
                            </div>
  
                            <div className="card-body pt-3">
                              <div className="row mt-2">
                                <div className="col">
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Nama Lengkap
                                    </label>
  
                                    <p className="form-control">
                                      {data.fullname ?? ""}
                                    </p>
                                  </div>
  
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      NIP
                                    </label>
                                    <p className="form-control">
                                      {data.nip ?? ""}
                                    </p>
                                  </div>
  
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Email
                                    </label>
                                    <p className="form-control">
                                      {data.email ?? ""}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Nomor Telepon
                                    </label>
                                    <p className="form-control">
                                      {data.phone_number ?? ""}
                                    </p>
                                  </div>
  
                                  <div className="row">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Jenis Kelamin
                                    </label>
                                  </div>
  
                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="gender"
                                    id="Laki-Laki"
                                    value="Laki-Laki"
                                    autocomplete="off"
                                    checked={data.gender === "Laki-Laki"}
                                    disabled
                                  />
                                  <label
                                    className="btn btn-outline-primary btn-sm"
                                    for="Laki-Laki"
                                  >
                                    Laki-Laki
                                  </label>
  
                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="gender"
                                    id="Perempuan"
                                    value="Perempuan"
                                    autocomplete="off"
                                    checked={data.gender === "Perempuan"}
                                    disabled
                                  />
                                  <label
                                    className="btn btn-outline-secondary btn-sm"
                                    for="Perempuan"
                                  >
                                    Perempuan
                                  </label>
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Profesi
                                    </label>
                                    <p className="form-control">
                                      {data.role ?? ""}
                                    </p>
                                  </div>
                                </div>
                              </div>{" "}
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Alamat
                                    </label>
                                    <p className="form-control">
                                      {data.address ?? ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      for="exampleFormControlSelect1"
                                      className="form-control-label"
                                    >
                                      Provinsi
                                    </label>
                                    <p
                                      className="form-control"
                                      id="exampleFormControlSelect1"
                                    >
                                      {data.province ?? "s"}
                                    </p>
                                  </div>
                                </div>
  
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      for="exampleFormControlSelect1"
                                      className="form-control-label"
                                    >
                                      Kota
                                    </label>
                                    <p
                                      className="form-control"
                                      id="exampleFormControlSelect1"
                                    >
                                      {data.city ?? ""}
                                    </p>
                                  </div>
                                </div>
  
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      for="example-text-input"
                                      className="form-control-label"
                                    >
                                      Kode Pos
                                    </label>
                                    <p className="form-control">
                                      {data.postal_code ?? ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
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
