import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import HeaderDataUser from "../../component/Header/HeaderDataUser";
import SidebarPatient from "../../component/Sidebar/SidebarPatient";
import Paginations from "../../component/Pagination/Paginations";
import axios from "axios";
import { baseURL } from "../../routes/Config";
import WithAuthorization from "../../utils/auth";

const ResultDataDiagnosis = () => {
  const auth = WithAuthorization(["patient"]);

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [statusSearch, setStatusSearch] = useState(false);

  const ongoingCount = data.filter((item) => item.status === 1).length;
  const doneCount = data.filter((item) => item.status === 2).length;
  const totalDataCount = data.length;

  useEffect(() => {
    fetchData();
  }, [currentPage, userId, statusSearch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChange = (event) => {
    setUserId(event.target.value);
    setStatusSearch(true);
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${baseURL}/patients/result-diagnoses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
          limit: 10,
          offset: (currentPage - 1) * 10,
          verified: statusSearch ? 1 : 0,
        },
      });

      console.log("Fetched data:", response.data); // Debugging

      // Update data and pagination with new structure
      setData(response.data.data.data || []);
      setPagination({
        totalPages: response.data.data.totalPages || 0, // Sesuaikan dengan struktur respons
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (auth) {
    return (
      <div className="g-sidenav-show bg-gray-100">
        <div className="min-height-300 bg-primary position-absolute w-100"></div>
        <aside
          className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
          id="sidenav-main"
        >
          <SidebarPatient />
        </aside>
        <main className="main-content position-relative border-radius-lg">
          <HeaderDataUser />
          <div className="container-fluid py-2">
            <div className="row">
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                            Pemeriksaan
                          </p>
                          <h2 className="font-weight-bolder d-flex justify-content-left">
                            {totalDataCount}
                          </h2>
                          <p className="text-sm mb-0 font-weight-bold d-flex justify-content-left">
                            Pemeriksaan Diajukan
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                          <i
                            className="ni ni-money-coins text-lg opacity-10"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                            Done
                          </p>
                          <h2 className="font-weight-bolder d-flex justify-content-left">
                            {doneCount}
                          </h2>
                          <p className="text-sm mb-0 font-weight-bold d-flex justify-content-left">
                            Pemeriksaan Selesai
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                          <i
                            className="ni ni-world text-lg opacity-10"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                            PENDING
                          </p>
                          <h2 className="font-weight-bolder d-flex justify-content-left">
                            {ongoingCount}
                          </h2>
                          <p className="text-sm mb-0 font-weight-bold d-flex justify-content-left">
                            Pemeriksaan Diproses
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                          <i
                            className="ni ni-money-coins text-lg opacity-10"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row p-0 mt-4">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header pb-2 p-4">
                    <div className="row">
                      <div className="col-7 d-flex align-items-center">
                        <h5 className="mb-0 font-weight-bolder">Data Pasien</h5>
                      </div>
                      <div className="col-3 text-end pe-0">
                        <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                          <div className="input-group">
                            <span className="input-group-text text-body border-radius-xl">
                              <i className="fas fa-search" aria-hidden="true"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-radius-xl"
                              size="50"
                              placeholder="Nama Pasien, Kode Pasien..."
                              style={{ height: "80%" }}
                              onChange={handleChange}
                              value={userId}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2 mt-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0">
                              Tanggal Periksa
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              Dokter Verifikator
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length > 0 ? (
                            data.map((item) => (
                              <tr key={item.id}>
                                <td className="ps-0">
                                  <span className="text-secondary text-xs font-weight-bold">
                                    {moment(item.upload_date).format(
                                      "D-MM-YYYY"
                                    ) || " "}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm ps-2">
                                  <p className="text-xs text-secondary mb-0">
                                    {item.doctor_fullname || " "}
                                  </p>
                                </td>
                                <td className="align-middle text-start text-sm pe-0 text-center">
                                  <Link
                                    to={`/patient-detail-result/${item.id}`}
                                  >
                                    {item.status === 0 ? (
                                      <div></div>
                                    ) : (
                                      <span className="badge text-secondary badge-sm bg-gradient-white border border-gray">
                                        Lihat Detail
                                      </span>
                                    )}
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
      </div>
    );
  }
};

export default ResultDataDiagnosis;
