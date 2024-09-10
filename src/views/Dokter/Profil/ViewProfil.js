import axios from "axios";
import { React, useState } from "react";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";

const ViewProfil = ({ auth, token }) => {
  const isAuth = WithAuthorization(["doctor"]);

  const [data, setData] = useState(auth);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      await axios
        .put(`${baseURL}/users/edit/picture`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    await axios
      .put(`${baseURL}/users/edit/profile`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if(isAuth) {
    return (
      <div>
        <div className="card-body px-0 pb-2 mt-2">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-none border-0">
                <div className="card-header pb-0">
                  <div className="d-flex align-items-center">
                    <h6 className="mb-0 font-weight-bolder">Data Diri</h6>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row gx-4">
                    <div className="col-auto">
                      <div className="avatar avatar-xl position-relative">
                        <img
                          src={`${baseURL + data.profile_picture}`}
                          alt="profile_image"
                          className="w-100 border-radius-lg shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="col-auto my-auto">
                      <div className="h-100">
                        <input
                          type="file"
                          className="text-xs mb-1"
                          name="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <p className="mb-0 text-xs">
                          Hanya gunakan gambar dengan format .jpg/.png
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <div className="row mt-2">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="fullname" className="form-control-label">
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
                        <label htmlFor="email" className="form-control-label">
                          Email
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Masukkan email anda"
                          value={data.email}
                          name="email"
                          disabled
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
                          type="text"
                          placeholder="Masukkan nomor telepon anda"
                          value={data.phone_number}
                          name="phone_number"
                          disabled
                        />
                      </div>
  
                      <div className="row">
                        <label htmlFor="gender" className="form-control-label">
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
                        <label htmlFor="role" className="form-control-label">
                          Profesi
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Masukkan profesi anda"
                          value={data.role}
                          name="role"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
  
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="address" className="form-control-label">
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
                        <label htmlFor="province" className="form-control-label">
                          Provinsi
                        </label>
                        <select
                          className="form-select"
                          id="province"
                          name="province"
                          value={data.province}
                          onChange={handleChange}
                        >
                          <option value="">Provinsi</option>
                          <option value="Sulawesi Selatan">
                            Sulawesi Selatan
                          </option>
                          <option value="Jawa Timur">Jawa Timur</option>
                          <option value="Jawa Tengah">Jawa Tengah</option>
                          <option value="DKI Jakarta">DKI Jakarta</option>
                          <option value="Jawa Barat">Jawa Barat</option>
                        </select>
                      </div>
                    </div>
  
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="city" className="form-control-label">
                          Kota
                        </label>
                        <select
                          className="form-select"
                          id="city"
                          name="city"
                          value={data.city}
                          onChange={handleChange}
                        >
                          <option value="">Kota</option>
                          <option value="Makassasr">Makassar</option>
                          <option value="Surabaya">Surabaya</option>
                          <option value="Semarang">Semarang</option>
                          <option value="Jakarta">Jakarta</option>
                          <option value="Banten">Banten</option>
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
                          type="text"
                          placeholder="Kode pos"
                          value={data.postal_code}
                          name="postal_code"
                          onChange={handleChange}
                        />
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
    );
  } else {
    return <div></div>
  }
};

export default ViewProfil;
