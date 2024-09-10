import axios from "axios";
import moment from "moment/moment";
import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import Paginations from "../../../component/Pagination/Paginations";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";

const DataPasienDokter = () => {
  const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [inputText, setInputText] = useState("");
  const [statusSearch, setStatusSearch] = useState(false);

  const handleChange = (event) => {
    setInputText(event.target.value);
    setStatusSearch(true);
  };

  const token = sessionStorage.getItem("token");
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
            <SidebarDokter />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            <HeaderDataUser />
            <div className="container-fluid py-2">
              <div class="row">
                <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4 ">
                  <div class="card">
                    <div class="card-body p-3">
                      <div class="row ">
                        <div class="col-8 ">
                          <div class="numbers ">
                            <p class="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 class="font-weight-bolder d-flex justify-content-left">
                              {pagination.total}
                            </h2>
                            <p class="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Keseluruhan Pasien
                            </p>
                          </div>
                        </div>
                        <div class="col-4 text-end">
                          <div class="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                            <i
                              class="ni ni-badge text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div class="card">
                    <div class="card-body p-3">
                      <div class="row">
                        <div class="col-8 ">
                          <div class="numbers ">
                            <p class="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 class="font-weight-bolder d-flex justify-content-left">
                              {pagination.verified}
                            </h2>
                            <p class="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Telah Diverifikasi
                            </p>
                          </div>
                        </div>
                        <div class="col-4 text-end">
                          <div class="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                            <i
                              class="ni ni-sound-wave text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div class="card">
                    <div class="card-body p-3">
                      <div class="row">
                        <div class="col-8 ">
                          <div class="numbers ">
                            <p class="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 class="font-weight-bolder d-flex justify-content-left">
                              {pagination.unverified}
                            </h2>
                            <p class="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Belum Diverifikasi
                            </p>
                          </div>
                        </div>
                        <div class="col-4 text-end">
                          <div class="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                            <i
                              class="ni ni-chart-pie-35 text-lg opacity-10"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div class="card">
                    <div class="card-body p-3">
                      <div class="row">
                        <div class="col-8 ">
                          <div class="numbers ">
                            <p class="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              Pasien
                            </p>
                            <h2 class="font-weight-bolder d-flex justify-content-left">
                              {pagination.thisMonth}
                            </h2>
                            <p class="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Verifikasi Bulan Ini
                            </p>
                          </div>
                        </div>
                        <div class="col-4 text-end">
                          <div class="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                            <i
                              class="ni ni-chart-bar-32 text-lg opacity-10"
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
                        <div className="col-9 d-flex align-items-center">
                          <h5 className="mb-0 font-weight-bolder">
                            Data Pasien
                          </h5>
                        </div>
                        <div class="col-3 text-end pe-2">
                          <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div class="input-group">
                              <span class="input-group-text text-body border-radius-xl">
                                <i class="fas fa-search" aria-hidden="true"></i>
                              </span>
                              <input
                                type="text"
                                class="form-control border-radius-xl"
                                size="50"
                                placeholder="Nama Pasien, Kode Pasien..."
                                style={{ height: "80%" }}
                                onChange={handleChange}
                                value={inputText}
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
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0 text-center">
                                Kode RM
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Nama Pasien
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Radiografer
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0">
                                Tgl Upload Gambar
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Status
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 pe-0 text-center">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item) => (
                              <tr>
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
                                  <span className="text-secondary text-xs font-weight-bold">
                                    {moment(
                                      item.updated_at ?? item.created_at
                                    ).format("DD-MM-YYYY")}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm">
                                  <span
                                    class={`badge border-radius-xl badge-sm bg-gradient-${
                                      item.panoramik_check_date !== null
                                        ? "success"
                                        : "warning"
                                    }`}
                                  >
                                    {item.panoramik_check_date !== null
                                      ? "Selesai"
                                      : "Proses"}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm pe-0 text-center">
                                  <Link
                                    to={`/dokter-view-data-pasien/${item.id}`}
                                  >
                                    <span className="badge text-secondary badge-sm bg-gradient-white border border-gray">
                                      Lihat Detail
                                    </span>
                                  </Link>
                                </td>
                              </tr>
                            ))}
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
        </body>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default DataPasienDokter;
