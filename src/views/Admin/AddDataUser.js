import { React, useState } from "react";
import axios from "axios";
import HeaderAdmin from "../../component/Header/HeaderAdmin";
import SidebarAdmin from "../../component/Sidebar/SidebarAdmin";
import { baseURL } from "../../routes/Config";
import WithAuthorization from "../../utils/auth";
import RegistrasiConfirm from "../../component/Modal/RegistrasiConfirm";

const AddDataUser = () => {
  const auth = WithAuthorization(["admin"]);

  const [password, setPassword] = useState("0");
  const [data, setData] = useState({
    fullname: "",
    nip: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    address: "",
    province: "",
    city: "",
    post_code: "",
  });
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);

  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  axios
    .get("https://muh-arga.github.io/api-wilayah-indonesia/api/provinces.json")
    .then((response) => {
      setProvince(response.data);
    });

  const handleProvinceChange = (e) => {
    e.preventDefault();

    axios
      .get(
        `https://muh-arga.github.io/api-wilayah-indonesia/api/province/${e.target.value}.json`
      )
      .then((response) => {
        setData({
          ...data,
          province: response.data.name,
        });
      });

    axios
      .get(
        `https://muh-arga.github.io/api-wilayah-indonesia/api/regencies/${e.target.value}.json`
      )
      .then((response) => {
        setCity(response.data);
      });
  };

  const handleCityChange = (e) => {
    e.preventDefault();

    axios
      .get(
        `https://muh-arga.github.io/api-wilayah-indonesia/api/regency/${e.target.value}.json`
      )
      .then((response) => {
        setData({
          ...data,
          city: response.data.name,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${baseURL}/users`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // window.location.href = "/data-user";
        setPassword(response.data.newPassword);
        setPassword(response.data.newPassword);
        var phone_new_format = "";
        if (response.data.data.phone_number.startsWith("08")) {
          phone_new_format =
            "628" + response.data.data.phone_number.substring(2);
        } else {
          phone_new_format = response.data.data.phone_number;
        }

        const message =
          "Halo untuk user " +
          response.data.data.email +
          " passwordnya = " +
          response.data.newPassword;
        const waLink = `https://wa.me/${phone_new_format}?text=${encodeURIComponent(
          message
        )}`;
        window.open(waLink);
      })
      .catch((error) => {
        console.log(error.response.data);
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
                                  Tambah Data User
                                </h6>
                              </div>
                            </div>

                            <div className="card-body pt-3">
                              <div className="row mt-2">
                                <div className="col">
                                  <div className="form-group">
                                    <label
                                      htmlFor="fullname"
                                      className="form-control-label"
                                    >
                                      Nama Lengkap
                                    </label>
                                    <input
                                      name="fullname"
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan nama lengkap anda"
                                      value={data.fullname}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label
                                      htmlFor="nip"
                                      className="form-control-label"
                                    >
                                      NIP
                                    </label>
                                    <input
                                      name="nip"
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan NIP"
                                      value={data.nip}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label
                                      htmlFor="email"
                                      className="form-control-label"
                                    >
                                      Email
                                    </label>
                                    <input
                                      name="email"
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan email anda"
                                      value={data.email}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label
                                      htmlFor="phone"
                                      className="form-control-label"
                                    >
                                      Nomor Telepon
                                    </label>
                                    <input
                                      name="phone"
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan nomor telepon anda"
                                      value={data.phone}
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
                                  <div className="form-group">
                                    <label
                                      htmlFor="role"
                                      className="form-control-label"
                                    >
                                      Profesi
                                    </label>
                                    <select
                                      name="role"
                                      className="form-select"
                                      id="profession"
                                      placeholder="Masukkan profesi anda"
                                      value={data.role}
                                      onChange={handleChange}
                                    >
                                      <option value="radiographer">
                                        Radiographer
                                      </option>
                                      <option value="doctor">Doctor</option>
                                    </select>
                                  </div>
                                </div>
                              </div>{" "}
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label
                                      htmlFor="address"
                                      className="form-control-label"
                                    >
                                      Alamat
                                    </label>
                                    <textarea
                                      name="address"
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan alamat anda"
                                      value={data.address}
                                      onChange={handleChange}
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      htmlFor="province"
                                      className="form-control-label"
                                    >
                                      Provinsi
                                    </label>
                                    <select
                                      name="province"
                                      className="form-select"
                                      id="province"
                                      defaultValue={data.province}
                                      onChange={handleProvinceChange}
                                    >
                                      <option>Provinsi</option>
                                      {province.map((province) => (
                                        <option value={province.id}>
                                          {province.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      htmlFor="city"
                                      className="form-control-label"
                                    >
                                      Kota
                                    </label>
                                    <select
                                      name="city"
                                      className="form-select"
                                      id="city"
                                      defaultValue={data.city}
                                      onChange={handleCityChange}
                                    >
                                      <option>Kota</option>
                                      {city.map((city) => (
                                        <option value={city.id}>
                                          {city.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      htmlFor="post_code"
                                      className="form-control-label"
                                    >
                                      Kode Pos
                                    </label>
                                    <input
                                      name="post_code"
                                      className="form-control"
                                      type="text"
                                      placeholder="Kode pos"
                                      value={data.post_code}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-end mt-4">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm ms-auto"
                                  onClick={handleSubmit}
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal2"
                                >
                                  Daftar Akun
                                </button>
                              </div>
                              <RegistrasiConfirm password={password} />
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

export default AddDataUser;
