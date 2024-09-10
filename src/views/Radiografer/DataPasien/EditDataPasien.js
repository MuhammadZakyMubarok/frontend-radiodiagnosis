import axios from "axios";
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";

const EditDataPasien = () => {
  const auth = WithAuthorization(["radiographer"]);

  const [data, setData] = useState({
    fullname: "",
    medic_number: "",
    id_number: "",
    gender: "",
    religion: "",
    address: "",
    born_location: "",
    born_date: "",
    phone_number: "",
    referral_origin: "",
    radiographic_id: "",
  });

  const [radiographics, setRadiographics] = useState([]);

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

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
        console.log(error);
      });

    axios
      .get(`${baseURL}/radiographics/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          setRadiographics(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${baseURL}/patients/edit/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData({
          ...data,
          updated_at: Date.now(),
        });
        window.location.href = "/radiografer-data-pasien";
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  console.log(radiographics);

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
              <div className="row p-0">
                <div className="col-12">
                  <div className="card mb-4">
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
                    </div>
  
                    <div className="card-body px-0 pb-2 pt-0">
                      <div className="row justify-content-center">
                        <div className="col-md-6">
                          <div className="card shadow-none border-0">
                            <div className="card-header pb-0">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 font-weight-bolder">
                                  Edit Data Pasien
                                </h6>
                              </div>
                            </div>
  
                            <div className="card-body pt-3">
                              <div className="row">
                                <div className="col">
                                  <div className="form-group">
                                    <label
                                      htmlFor="fullname"
                                      className="form-control-label"
                                    >
                                      Nama Lengkap
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan nama lengkap pasien"
                                      value={data.fullname}
                                      name="fullname"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="row-cols-md-3">
                                    <div className="form-group">
                                      <label
                                        htmlFor="medic_number"
                                        className="form-control-label"
                                      >
                                        Nomor Rekam Medik
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Nomor RM pasien"
                                        value={data.medic_number}
                                        name="medic_number"
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
  
                                  <div className="form-group">
                                    <label
                                      htmlFor="id_number"
                                      className="form-control-label"
                                    >
                                      NIK (Nomor Induk Kewarganegaraan)
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan NIK pasien"
                                      value={data.id_number}
                                      name="id_number"
                                      onChange={handleChange}
                                    />
                                  </div>
  
                                  <div className="row">
                                    <label
                                      htmlFor="gender"
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
                                    autoComplete="off"
                                    checked={data.gender === "Laki-Laki"}
                                    onChange={handleChange}
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
                                    name="gender"
                                    id="Perempuan"
                                    value="Perempuan"
                                    autoComplete="off"
                                    checked={data.gender === "Perempuan"}
                                    onChange={handleChange}
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
                                        htmlFor="religion"
                                        className="form-control-label"
                                      >
                                        Agama
                                      </label>
  
                                      <select
                                        className="form-select"
                                        id="religion"
                                        name="religion"
                                        value={data.religion}
                                        onChange={handleChange}
                                      >
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Budha">Budha</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Protestan">
                                          Protestan
                                        </option>
                                      </select>
                                    </div>
                                  </div>
  
                                  <div className="form-group">
                                    <label
                                      htmlFor="address"
                                      className="form-control-label"
                                    >
                                      Alamat
                                    </label>
                                    <textarea
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan alamat anda"
                                      value={data.address}
                                      name="address"
                                      onChange={handleChange}
                                    ></textarea>
                                  </div>
  
                                  <label
                                    htmlFor="born_location"
                                    className="form-control-label"
                                  >
                                    Tempat Tanggal Lahir
                                  </label>
  
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Tempat lahir"
                                          value={data.born_location}
                                          name="born_location"
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <input
                                          className="form-control"
                                          type="date"
                                          placeholder="Tanggal lahir"
                                          value={data.born_date}
                                          name="born_date"
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
  
                                  <div className="form-group">
                                    <label
                                      htmlFor="phone_number"
                                      className="form-control-label"
                                    >
                                      Nomor Telepon
                                    </label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan nomor telepon"
                                      value={data.phone_number}
                                      name="phone_number"
                                      onChange={handleChange}
                                    />
                                  </div>
  
                                  <div className="form-group">
                                    <label
                                      htmlFor="referral_origin"
                                      className="form-control-label"
                                    >
                                      Asal Rujukan
                                    </label>
                                    <select
                                      className="form-select"
                                      id="referral_origin"
                                      name="referral_origin"
                                      value={data.referral_origin}
                                      onChange={handleChange}
                                    >
                                      <option value="Radiologi">Radiologi</option>
                                      <option value="Bedah Mulut dan Maksilofasial">
                                        Bedah Mulut dan Maksilofasial
                                      </option>
                                      <option value="Ilmu Kedokteran Gigi Anak">
                                        Ilmu Kedokteran Gigi Anak
                                      </option>
                                      <option value="Ilmu Penyakit Mulut">
                                        Ilmu Penyakit Mulut
                                      </option>
                                      <option value="Konservasi Gigi">
                                        Konservasi Gigi
                                      </option>
                                      <option value="Prostodonsia">
                                        Prostodonsia
                                      </option>
                                      <option value="Periodonsia">
                                        Periodonsia
                                      </option>
                                      <option value="Ortodonti">Ortodonti</option>
                                      <option value="Umum">Umum</option>
                                    </select>
                                  </div>
                                  <hr className="horizontal dark" />
                                  <p className=" text-sm text-uppercase">
                                    Data Radiografer
                                  </p>
                                  <div className="form-group">
                                    <label
                                      htmlFor="radiographic_id"
                                      className="form-control-label"
                                    >
                                      Pilih Radiografer
                                    </label>
                                    <select
                                      className="form-select"
                                      id="radiographic_id"
                                      name="radiographic_id"
                                      value={data.radiographic_id}
                                      onChange={handleChange}
                                    >
                                      <option>pilih radiografer</option>
                                      {radiographics.map((radiographic) => {
                                        return (
                                          <option
                                            key={radiographic.id}
                                            value={radiographic.id}
                                          >
                                            {radiographic.fullname}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-end mt-4">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm ms-auto"
                                  onClick={handleSubmit}
                                >
                                  Simpan Data Pasien
                                </button>
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

export default EditDataPasien;
