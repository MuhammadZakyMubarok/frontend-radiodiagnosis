import axios from "axios";
import { React, useState } from "react";
import { baseURL } from "../routes/Config";
import { useNavigate } from "react-router-dom";

const RegistrationCardPatient = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone_number: "",
        gender: "",
        address: "",
        province: "",
        city: "",
        postal_code: "",
        religion: "",
        born_location: "", // Menambahkan born_location
        born_date: "", // Menambahkan born_date
        status_user: 1,
    });

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
            navigate("/login-patient"); // Arahkan ke halaman login-Patient setelah pendaftaran berhasil
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Pendaftaran gagal";
            setError(errorMessage); // Tampilkan pesan error yang diterima dari backend
        }
    };

    return (
        <div>
            <main className="main-content mt-0">
                <section>
                    <div className="page-header min-vh-100">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 col-md-10 mx-auto">
                                    <div className="card card-plain">
                                        <div className="card-header pb-0 text-start">
                                            <h4 className="font-weight-bolder">Patient Registration</h4>
                                            <p className="mb-0">Enter your details to register</p>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                {error && <div className="alert alert-danger">{error}</div>}
                                            </div>
                                            <form role="form" onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="fullname" className="form-label">Full Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="fullname"
                                                                placeholder="Full Name"
                                                                name="fullname"
                                                                value={data.fullname}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
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
                                                        <div className="mb-3">
                                                            <label htmlFor="phone_number" className="form-label">Phone</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="phone_number"
                                                                placeholder="Phone"
                                                                name="phone_number"
                                                                value={data.phone_number}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="gender" className="form-label">Gender</label>
                                                            <select
                                                                className="form-control form-control-lg"
                                                                id="gender"
                                                                name="gender"
                                                                value={data.gender}
                                                                onChange={handleChange}
                                                                required
                                                            >
                                                                <option value="">Select Gender</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="address" className="form-label">Address</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="address"
                                                                placeholder="Address"
                                                                name="address"
                                                                value={data.address}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="born_location" className="form-label">Born Location</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="born_location"
                                                                placeholder="Born Location"
                                                                name="born_location"
                                                                value={data.born_location}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="born_date" className="form-label">Born Date</label>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-lg"
                                                                id="born_date"
                                                                name="born_date"
                                                                value={data.born_date}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="province" className="form-label">Province</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="province"
                                                                placeholder="Province"
                                                                name="province"
                                                                value={data.province}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="city" className="form-label">City</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="city"
                                                                placeholder="City"
                                                                name="city"
                                                                value={data.city}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="postal_code" className="form-label">Postal Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                id="postal_code"
                                                                placeholder="Postal Code"
                                                                name="postal_code"
                                                                value={data.postal_code}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="religion" className="form-label">Religion</label>
                                                            <select
                                                                className="form-control form-control-lg"
                                                                id="religion"
                                                                name="religion"
                                                                value={data.religion}
                                                                onChange={handleChange}
                                                                required
                                                            >
                                                                <option value="">Select Religion</option>
                                                                <option value="islam">Islam</option>
                                                                <option value="christian">Christian</option>
                                                                <option value="catholic">Catholic</option>
                                                                <option value="hindu">Hindu</option>
                                                                <option value="buddhist">Buddhist</option>
                                                                <option value="other">Other</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4 mb-0">Register</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RegistrationCardPatient;
