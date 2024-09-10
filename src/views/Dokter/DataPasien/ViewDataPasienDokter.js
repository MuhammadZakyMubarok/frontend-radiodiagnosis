import axios from "axios";
import {React, useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";

const ViewDataPasienDokter = () => {
  const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState({});

  const {id} = useParams()
  const token = sessionStorage.getItem("token");

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

  if(auth) {
    return (
      <div>
        <body className="g-sidenav-show bg-gray-100">
          <div className="min-height-300 bg-primary position-absolute w-100"></div>
          <aside
            className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
            id="sidenav-main"
          >
            <SidebarDokter />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            <HeaderDataUser />
            <div className="container-fluid py-2">
              <div className="row p-0">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-8 d-flex align-items-center">
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/dokter-data-pasien"
                          >
                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
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
                                  Data Pasien
                                </h6>
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
                                    autoComplete="off"
                                    checked = {data.gender === "Laki-Laki"}
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
                                    autoComplete="off"
                                    checked={data.gender === "Perempuan"}
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

export default ViewDataPasienDokter;
