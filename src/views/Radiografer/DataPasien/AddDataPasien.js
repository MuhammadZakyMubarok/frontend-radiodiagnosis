import axios from "axios";
import { React, useState, useEffect } from "react";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";

const AddDataPasien = () => {
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

  const token = sessionStorage.getItem("token");

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${baseURL}/patients`, data, {
        headers: {
          "Content-Type": "application/json",
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

  if (auth) {
    return (
      <div>
        <body class="g-sidenav-show bg-gray-100">
          <div class="min-height-300 bg-primary position-absolute w-100"></div>
          <aside
            class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
            id="sidenav-main"
          >
            <SidebarRadiografer />
          </aside>
          <main class="main-content position-relative border-radius-lg">
            <HeaderDataUser />
            <div class="container-fluid py-2">
              <div class="row p-0">
                <div class="col-12">
                  <div class="card mb-4">
                    <div class="card-header pb-2 p-4">
                      <div class="row">
                        <div class="col-6 d-flex align-items-center">
                          <a
                            class="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/radiografer-data-pasien"
                          >
                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                            &nbsp;&nbsp;Kembali
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="card-body px-0 pb-2 pt-0">
                      <div class="row justify-content-center">
                        <div class="col-md-6">
                          <div class="card shadow-none border-0">
                            <div class="card-header pb-0">
                              <div class="d-flex align-items-center">
                                <h6 class="mb-0 font-weight-bolder">
                                  Tambah Data Pasien
                                </h6>
                              </div>
                            </div>

                            <div class="card-body pt-3">
                              <div class="row">
                                <div class="col">
                                  <div class="form-group">
                                    <label
                                      for="fullname"
                                      class="form-control-label"
                                    >
                                      Nama Lengkap
                                    </label>
                                    <input
                                      class="form-control"
                                      type="text"
                                      placeholder="Masukkan nama lengkap pasien"
                                      value={data.fullname}
                                      name="fullname"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div class="row-cols-md-3">
                                    <div class="form-group">
                                      <label
                                        for="medic_number"
                                        class="form-control-label"
                                      >
                                        Nomor Rekam Medik
                                      </label>
                                      <input
                                        class="form-control"
                                        type="text"
                                        placeholder="Nomor RM pasien"
                                        value={data.medic_number}
                                        name="medic_number"
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>

                                  <div class="form-group">
                                    <label
                                      for="id_number"
                                      class="form-control-label"
                                    >
                                      NIK (Nomor Induk Kewarganegaraan)
                                    </label>
                                    <input
                                      class="form-control"
                                      type="text"
                                      placeholder="Masukkan NIK pasien"
                                      value={data.id_number}
                                      name="id_number"
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div class="row">
                                    <label
                                      for="gender"
                                      class="form-control-label"
                                    >
                                      Jenis Kelamin
                                    </label>
                                  </div>

                                  <input
                                    type="radio"
                                    class="btn-check"
                                    name="gender"
                                    id="Laki-Laki"
                                    autocomplete="off"
                                    value="Laki-Laki"
                                    checked={data.gender === "Laki-Laki"}
                                    onChange={handleChange}
                                  />
                                  <label
                                    class="btn btn-outline-primary btn-sm"
                                    for="Laki-Laki"
                                  >
                                    Laki-Laki
                                  </label>

                                  <input
                                    type="radio"
                                    class="btn-check"
                                    name="gender"
                                    id="Perempuan"
                                    autocomplete="off"
                                    value="Perempuan"
                                    checked={data.gender === "Perempuan"}
                                    onChange={handleChange}
                                  />
                                  <label
                                    class="btn btn-outline-secondary btn-sm"
                                    for="Perempuan"
                                  >
                                    Perempuan
                                  </label>

                                  <div class="row-cols-md-3">
                                    <div class="form-group">
                                      <label
                                        for="religion"
                                        class="form-control-label"
                                      >
                                        Agama
                                      </label>

                                      <select
                                        class="form-select"
                                        id="religion"
                                        name="religion"
                                        defaultValue={data.religion}
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

                                  <div class="form-group">
                                    <label
                                      for="address"
                                      class="form-control-label"
                                    >
                                      Alamat
                                    </label>
                                    <textarea
                                      class="form-control"
                                      type="text"
                                      placeholder="Masukkan alamat anda"
                                      value={data.address}
                                      name="address"
                                      onChange={handleChange}
                                    ></textarea>
                                  </div>

                                  <label
                                    for="born_location"
                                    class="form-control-label"
                                  >
                                    Tempat Tanggal Lahir
                                  </label>

                                  <div class="row">
                                    <div class="col-md-6">
                                      <div class="form-group">
                                        <input
                                          class="form-control"
                                          type="text"
                                          placeholder="Tempat lahir"
                                          value={data.born_location}
                                          name="born_location"
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="form-group">
                                        <input
                                          class="form-control"
                                          type="date"
                                          placeholder="Tanggal lahir"
                                          value={data.born_date}
                                          name="born_date"
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* <label
                                    for="example-text-input"
                                    class="form-control-label"
                                  >
                                    Umur Pasien
                                  </label>
                                  <div class="row">
                                    <div class="col-md-3">
                                      <div class="form-group">
                                        <input
                                          class="form-control"
                                          type="text"
                                          placeholder="Tahun"
                                          value=""
                                        />
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div class="form-group">
                                        <input
                                          class="form-control"
                                          type="text"
                                          placeholder="Bulan"
                                          value=""
                                        />
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div class="form-group">
                                        <input
                                          class="form-control"
                                          type="text"
                                          placeholder="Hari"
                                          value=""
                                        />
                                      </div>
                                    </div>
                                  </div> */}

                                  <div class="form-group">
                                    <label
                                      for="phone_number"
                                      class="form-control-label"
                                    >
                                      Nomor Telepon
                                    </label>
                                    <input
                                      class="form-control"
                                      type="text"
                                      placeholder="Masukkan nomor telepon"
                                      value={data.phone_number}
                                      name="phone_number"
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div class="form-group">
                                    <label
                                      for="referral_origin"
                                      class="form-control-label"
                                    >
                                      Asal Rujukan
                                    </label>
                                    <select
                                      class="form-select"
                                      id="referral_origin"
                                      name="referral_origin"
                                      defaultValue={data.referral_origin}
                                      onChange={handleChange}
                                    >
                                      <option value="Radiologi">
                                        Radiologi
                                      </option>
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
                                      <option value="Ortodonti">
                                        Ortodonti
                                      </option>
                                      <option value="Umum">Umum</option>
                                    </select>
                                  </div>
                                  <hr class="horizontal dark" />
                                  <p class=" text-sm text-uppercase">
                                    Data Radiografer
                                  </p>
                                  <div class="form-group">
                                    <label
                                      for="radiographic_id"
                                      class="form-control-label"
                                    >
                                      Pilih Radiografer
                                    </label>
                                    <select
                                      class="form-select"
                                      id="radiographic_id"
                                      name="radiographic_id"
                                      defaultValue={data.radiographic_id}
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
                              <div class="d-flex justify-content-end mt-4">
                                <button
                                  type="button"
                                  class="btn btn-primary btn-sm ms-auto"
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
    return <div></div>;
  }
};

export default AddDataPasien;
