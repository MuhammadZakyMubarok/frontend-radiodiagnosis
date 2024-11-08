import axios from "axios";
import moment from "moment/moment";
import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderUser from "../../../component/Header/HeaderUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import Paginations from "../../../component/Pagination/Paginations";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import ConfirmModal from "../../../component/Modal/ConfirmModal";
import "../../Responsive/responsive.css";



const DataPasien = () => {
  const auth = WithAuthorization(["radiographer"]);

  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [inputText, setInputText] = useState("");
  const [statusSearch, setStatusSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleChange = (event) => {
    setInputText(event.target.value);
    setStatusSearch(true);
  };

  const token = sessionStorage.getItem("token");
  // get data user use axios
  useEffect(() => {
    let url = `${baseURL}/patients/all?page=${currentPage}`;
    if (inputText !== undefined) {
      url += `&search=${inputText}`;
    }

    axios
      .get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          setData(response.data.data);
          setPagination(response.data.meta);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPage, inputText]);

  const toggleStatusUser = async (patientId, statusUser) => {
    try {
      await axios.put(
        `${baseURL}/patients/status/${patientId}/${statusUser}`, // Memperbarui URL dengan status_user
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh data setelah mengganti status
      setData((prevData) =>
        prevData.map((item) =>
          item.id === patientId ? { ...item, status_user: statusUser === 0 ? 1 : 0 } : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSpanClick = (item) => {
    setSelectedPatient(item);
    setIsModalOpen(true); // Buka modal
  };
    
  const handleConfirm = (patientId, statusUser) => {
    toggleStatusUser(patientId, statusUser);
    setIsModalOpen(false); // Tutup modal setelah konfirmasi
    setSelectedPatient(null);
  };
  

  console.log(pagination);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <SidebarRadiografer />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            {/* <HeaderUser /> */}
            <HeaderDataUser />
            <div className="container-fluid py-2">
              <div className="row">
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 ">
                  <div className="card" id="card-l2">
                    <div className="card-body p-3">
                      <div className="row ">
                        <div className="col-8 ">
                          <div className="numbers ">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 className="font-weight-bolder d-flex justify-content-left">
                              {pagination.total}
                            </h2>
                            <p className="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Keseluruhan Pasien
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                            <i
                              className="ni ni-badge text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card" id="card-l">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8 ">
                          <div className="numbers ">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 className="font-weight-bolder d-flex justify-content-left">
                              {pagination.verified}
                            </h2>
                            <p className="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Telah Diverifikasi
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                            <i
                              className="ni ni-sound-wave text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card" id="card-l2">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8 ">
                          <div className="numbers ">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 className="font-weight-bolder d-flex justify-content-left">
                              {pagination.thisDay}
                            </h2>
                            <p className="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Panoramik Hari Ini
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                            <i
                              className="ni ni-chart-pie-35 text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card" id="card-l">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8 ">
                          <div className="numbers ">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 className="font-weight-bolder d-flex justify-content-left">
                              {pagination.thisMonth}
                            </h2>
                            <p className="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Panoramik Bulan Ini
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                            <i
                              className="ni ni-chart-bar-32 text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 mb-2">
                <div className="col-12">
                  <div className="card" id="card-l2">
                    <div className="card-header pb-0 p-4">
                      <div className="row align-items-center">
                        <div className="col-md-6 col-12 mb-2 mb-md-0">
                          <h5 className="mb-0 font-weight-bolder">
                            Data Pasien
                          </h5>
                        </div>
                        <div className="col-md-4 col-12 text-md-end text-center mb-2 mb-md-0 pe-0">
                          <div className="input-group" style={{ maxWidth: "100%" }}>
                            <span className="input-group-text text-body border-radius-xl">
                              <i
                                className="fas fa-search"
                                aria-hidden="true"
                              ></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-radius-xl"
                              size="50"
                              placeholder="Nama Pasien, Kode Pasien..."
                              onChange={handleChange}
                              value={inputText}
                            />
                          </div>
                        </div>
                        <div className="col-md-2 col-12 d-flex flex-column justify-content-center text-center">
                          <a
                            className="btn bg-gradient-primary btn-sm mb-0 border-radius-xl w-100"
                            href="/regis-patient" id="btn-add" 
                            // setelah regis auto kembali ke halaman data pasien karna masih di auth radiographer, cuman mesti di refresh biar data baru nya muncul
                          >
                            <i className="fas fa-plus"></i>&nbsp;&nbsp; Tambah Data
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body px-0 pb-2 mt-2">
                      <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                          <thead>
                            <tr>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0 text-center">
                                Kode RM
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Nama Pasien
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Radiografer
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0 text-center">
                                Tanggal Periksa
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center">
                                Status Radiografik
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center">
                                Status Akun
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 pe-0 text-center">
                                Aksi
                              </th>
                              {/* <!-- <th className="text-secondary opacity-7"></th> --> */}
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item) => (
                              <tr key={item.id}>
                                <td className="ps-0">
                                  <p className="text-xs text-secondary mb-0 text-center">
                                    {item.medic_number}
                                  </p>
                                </td>
                                <td className="align-middle text-start text-sm ps-2">
                                  <p className="text-xs text-secondary mb-0">
                                    {item.fullname}
                                  </p>
                                </td>
                                <td className="align-middle text-start text-sm ps-2">
                                  <p className="text-xs text-secondary mb-0">
                                    {item.radiographer}
                                  </p>
                                </td>
                                <td className="align-middle text-start ps-0">
                                  <p className="text-secondary text-xs font-weight-bold text-center">
                                    {moment(
                                      item.updated_at ?? item.created_at
                                    ).format("D-MM-YYYY")}
                                  </p>
                                </td>
                                <td className="align-middle text-start text-sm text-center">
                                  <p
                                    className={`text-xs text-secondary font-weight-bold mb-0 ${
                                      item.panoramik_check_date === null
                                        ? "text-info"
                                        : "text-secondary"
                                    }`}
                                  >
                                    {item.panoramik_check_date === null
                                      ? "Dalam Proses"
                                      : "Selesai"}
                                  </p>
                                </td>
                                <td className="align-middle text-start text-sm text-center">
                                  <p
                                    className={`text-xs text-secondary font-weight-bold mb-0 ${
                                      item.status_user === 1
                                        ? "text-success"
                                        : "text-warning"
                                    }`}
                                  >
                                    {item.status_user === 1 ? "Telah Disetujui" : "Belum Disetujui"}
                                  </p>

                                </td>
                                <td className="align-middle text-start text-sm pe-0 text-center">
                                  <Link
                                    to={`/radiografer-view-data-pasien/${item.id}`}
                                  >
                                    <p className="badge text-secondary badge-sm bg-gradient-white border border-gray">
                                      Lihat Detail
                                    </p>
                                  </Link>
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/* Render ConfirmModal jika selectedPatient ada */}
                        {selectedPatient}
                        {isModalOpen && selectedPatient && (
                          <ConfirmModal
                            patientId={selectedPatient.id}
                            statusUser={selectedPatient.status_user}
                            onConfirm={handleConfirm}
                            onClose={() => setIsModalOpen(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Paginations
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </main>
        </body>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default DataPasien;
