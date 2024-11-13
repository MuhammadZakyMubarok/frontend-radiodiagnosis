import axios from "axios";
import { React, useState, useEffect } from "react";
import { baseURL } from "../routes/Config";
import { useNavigate } from "react-router-dom";
import { ListOfCity } from "../component/Dropdown/ListOfCity";

const RegistrationCardPatient = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const [maxDate, setMaxDate] = useState("");

    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone_number: "",
        id_number: "",
        gender: "",
        address: "",
        province: "",
        city: "",
        postal_code: "",
        religion: "",
        born_location: "", // Menambahkan born_location
        born_date: "", // Menambahkan born_date
        referral_origin: "",
        age: "",
        status_user: 1,
    });

    const provinceMap = {
        "Jawa Timur": "jatim",
        "Jawa Barat": "jabar",
        "Jawa Tengah": "jateng",
        "Yogyakarta": "yogya",
        "Jakarta": "dki",
        "Banten": "banten",
    };

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Januari adalah 0!
        const yyyy = today.getFullYear();

        // Format tanggal menjadi YYYY-MM-DD
        setMaxDate(`${yyyy}-${mm}-${dd}`);
    }, []);


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseURL}/patients/register`, data);
            navigate("/"); // Arahkan ke halaman login setelah pendaftaran berhasil
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Pendaftaran gagal";
            setError(errorMessage); // Tampilkan pesan error yang diterima dari backend
        }
    };

    return (
        <div>
            <div className="min-height-200 bg-primary position-absolute w-100"></div>
            <main className="main-content position-relative border-radius-lg">
                <div className="container-fluid py-2">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto">
                            <div className="card mt-4 p-lg-6 p-sm-2" id="card-l">
                                <div className="card-header pb-lg-4 pb-md-2 text-start">
                                    <h4 className="font-weight-bolder">Registrasi Pasien</h4>
                                    <p className="mb-0"> Silahkan lengkapi informasi yang diperlukan untuk memudahkan proses pelayanan yang optimal.</p>
                                </div>
                                <div className="card-body pt-3">
                                    <div className="mb-3">
                                        {error && <div className="alert alert-danger">{error}</div>}
                                    </div>
                                    <form role="form" onSubmit={handleSubmit}>
                                        <div className="row justify-content-center">
                                            <div className="col-10">
                                                <div className="row-12 d-lg-flex d-md-none justify-content-around">
                                                    <div className="col-md-6 mb-3 me-2">
                                                        <label htmlFor="fullname" className="form-label">Nama Lengkap</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            id="fullname"
                                                            placeholder="Nama Lengkap"
                                                            name="fullname"
                                                            value={data.fullname}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label
                                                            for="id_number"
                                                            class="form-control-label"
                                                        >
                                                            NIK (Nomor Induk Kewarganegaraan)
                                                        </label>
                                                        <input
                                                            class="form-control"
                                                            type="number"
                                                            placeholder="Masukkan NIK"
                                                            value={data.id_number}
                                                            id="id_number"
                                                            name="id_number"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row-12 d-lg-flex d-md-none justify-content-around">
                                                    <div className="col-md-6 mb-3 me-2">
                                                        <label htmlFor="email" className="form-label">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control form-control-lg"
                                                            id="email"
                                                            placeholder="Email"
                                                            name="email"
                                                            value={data.email}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="phone_number" className="form-label">No. Telp</label>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-lg"
                                                            id="phone_number"
                                                            placeholder="Nomor Telepon"
                                                            name="phone_number"
                                                            value={data.phone_number}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="password" className="form-label">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control form-control-lg"
                                                        id="password"
                                                        placeholder="Password"
                                                        name="password"
                                                        value={data.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="row-12 d-lg-flex d-md-none justify-content-around">
                                                    <div className="col-md-6 mb-3 me-2">
                                                        <label htmlFor="address" className="form-label">Alamat Lengkap</label>
                                                        <textarea
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            id="address"
                                                            placeholder="Alamat Lengkap"
                                                            name="address"
                                                            value={data.address}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="postal_code" className="form-label">Kode Pos</label>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-lg"
                                                            id="postal_code"
                                                            placeholder="Kode Pos"
                                                            name="postal_code"
                                                            value={data.postal_code}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row-12 d-lg-flex d-md-none justify-content-around">
                                                    <div className="col-md-6 mb-3 me-2">
                                                        <label htmlFor="province" className="form-label">Provinsi</label>
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
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="city" className="form-label">Kota</label>
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
                                                <div className="mb-3">
                                                    <label htmlFor="age" className="form-label">Umur</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-lg"
                                                        id="age"
                                                        placeholder="Umur"
                                                        name="age"
                                                        value={data.age}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="row-12 d-lg-flex d-md-none justify-content-around">
                                                    <div className="col-md-6 mb-3 me-2">
                                                        <label htmlFor="born_location" className="form-label">Tempat Lahir</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            id="born_location"
                                                            placeholder="Tempat Lahir"
                                                            name="born_location"
                                                            value={data.born_location}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="born_date" className="form-label">Tanggal Lahir</label>
                                                        <input
                                                            type="date"
                                                            className="form-control form-control-lg"
                                                            id="born_date"
                                                            name="born_date"
                                                            value={data.born_date}
                                                            onChange={handleChange}
                                                            max={maxDate}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row-12 d-lg-flex d-md-none justify-content-around">
                                                    <div className="col-md-6 mb-3 me-2">
                                                        <label htmlFor="gender" className="form-label">Jenis Kelamin</label>
                                                        <select
                                                            className="form-control form-control-lg"
                                                            id="gender"
                                                            name="gender"
                                                            value={data.gender}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="">Pilih</option>
                                                            <option value="male">Laki - Laki</option>
                                                            <option value="female">Perempuan</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="religion" className="form-label">Agama</label>
                                                        <select
                                                            className="form-control form-control-lg"
                                                            id="religion"
                                                            name="religion"
                                                            value={data.religion}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="">Pilih</option>
                                                            <option value="islam">Islam</option>
                                                            <option value="christian">Kristen</option>
                                                            <option value="catholic">Katolik</option>
                                                            <option value="hindu">Hindu</option>
                                                            <option value="buddhist">Budha</option>
                                                            <option value="other">Lainnya</option>
                                                        </select>
                                                    </div>
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
                                                        <option value="">
                                                            Pilih Asal Rujukan
                                                        </option>
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
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4 mb-0">Register</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegistrationCardPatient;
