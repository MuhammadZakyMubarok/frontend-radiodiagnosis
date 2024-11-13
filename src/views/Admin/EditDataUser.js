import axios from "axios";
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderAdmin from "../../component/Header/HeaderAdmin";
import SidebarAdmin from "../../component/Sidebar/SidebarAdmin";
import { baseURL } from "../../routes/Config";
import WithAuthorization from "../../utils/auth";
import "../Responsive/responsive.css";
import { ListOfCity } from "../../component/Dropdown/ListOfCity";


export const EditDataUser = () => {
  const auth = WithAuthorization(["admin"]);
  const [cityOptions, setCityOptions] = useState([]);

  const [data, setData] = useState({
    fullname: "",
    nip: "",
    email: "",
    phone_number: "",
    gender: "",
    role: "",
    address: "",
    province: "",
    city: "",
    postal_code: "",
  });

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const provinceMap = {
    "Jawa Timur": "jatim",
    "Jawa Barat": "jabar",
    "Jawa Tengah": "jateng",
    "Yogyakarta": "yogya",
    "Jakarta": "dki",
    "Banten": "banten",
  };

  // get data user use axios
  useEffect(() => {
    axios
      .get(`${baseURL}/users/profile/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          const userData = response.data.data;
          setData(userData);

          // Set city options based on the user's province
          const provinceKey = provinceMap[userData.province];
          setCityOptions(ListOfCity[provinceKey] || []); // Update city options

          // Set the selected city
          setData((prevData) => ({
            ...prevData,
            city: userData.city, // Set the city from the database
          }));
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [id, token]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setData({
      ...data,
      city: selectedCity, // Simpan kota yang dipilih ke dalam state data
    });
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    const provinceKey = provinceMap[selectedProvince]; // Dapatkan kunci berdasarkan nama provinsi
    console.log("Selected Province Change:", selectedProvince); // Debugging
    console.log("Province Key Change:", provinceKey); // Debugging
    setData({
      ...data,
      province: selectedProvince, // Simpan nama provinsi
      city: '', // Reset kota saat provinsi berubah
    });
    setCityOptions(ListOfCity[provinceKey] || []); // Update city options
    console.log("City Options After Change:", ListOfCity[provinceKey]); // Debugging
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .put(`${baseURL}/users/edit/profile/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.href = "/data-user";
      })
      .catch((error) => {
        console.log(error.response.data);
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
            <SidebarAdmin />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            <HeaderAdmin />
            <div className="container-fluid py-2">
              <div className="row p-0">
                <div className="col-12">
                  <div className="card mb-4" id="card-l">
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
                                  Edit Data User
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
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan nama lengkap anda"
                                      value={data.fullname}
                                      name="fullname"
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
                                      className="form-control"
                                      type="number"
                                      placeholder="Masukkan NIP"
                                      value={data.nip}
                                      name="nip"
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
                                      className="form-control"
                                      type="email"
                                      placeholder="Masukkan email anda"
                                      value={data.email}
                                      name="email"
                                      onChange={handleChange}
                                    />
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
                                      type="number"
                                      placeholder="Masukkan nomor telepon anda"
                                      value={data.phone_number}
                                      name="phone_number"
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
                                    autocomplete="off"
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
                                    autocomplete="off"
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
                                      className="form-control"
                                      type="text"
                                      placeholder="Masukkan alamat anda"
                                      value={data.address}
                                      name="address"
                                      onChange={handleChange}
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      className="form-control-label"
                                    >
                                      Provinsi
                                    </label>
                                    <select
                                      name="province"
                                      className="form-select"
                                      id="province"
                                      value={data.province} // Gunakan value dari state data
                                      onChange={handleProvinceChange}
                                    >
                                      <option value="">Pilih Provinsi</option>
                                      <option value="Jawa Timur">Jawa Timur</option>
                                      <option value="Jawa Barat">Jawa Barat</option>
                                      <option value="Jawa Tengah">Jawa Tengah</option>
                                      <option value="Yogyakarta">Yogyakarta</option>
                                      <option value="Jakarta">Jakarta</option>
                                      <option value="Banten">Banten</option>
                                    </select>
                                  </div>
                                </div>
  
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      htmlFor="exampleFormControlSelect1"
                                      className="form-control-label"
                                    >
                                      Kota
                                    </label>
                                    <select
                                      name="city"
                                      className="form-select"
                                      id="city"
                                      value={data.city} // Gunakan value dari state data
                                      onChange={handleCityChange}
                                      disabled={!data.province} // Nonaktifkan jika provinsi tidak dipilih
                                    >
                                      <option value="">Pilih Kota</option>
                                      {cityOptions.map((cityObj, index) => (
                                        <option key={index} value={cityObj.city}>
                                          {cityObj.city}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
  
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label
                                      htmlFor="postal_code"
                                      className="form-control-label"
                                    >
                                      Kode Pos
                                    </label>
                                    <input
                                      className="form-control"
                                      type="number"
                                      placeholder="Kode pos"
                                      value={data.postal_code}
                                      name="postal_code"
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
                                >
                                  Simpan Perubahan
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

export default EditDataUser;
