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

const DataPasien = () => {
  const auth = WithAuthorization(["radiographer"]);

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
                  <div className="card">
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
                  <div className="card">
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
                  <div className="card">
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
                  <div className="card">
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
              <div className="row p-0 mt-4">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-7 d-flex align-items-center">
                          <h5 className="mb-0 font-weight-bolder">
                            Data Pasien
                          </h5>
                        </div>
                        <div className="col-3 text-end pe-0">
                          <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div className="input-group">
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
                                style={{ height: "80%" }}
                                onChange={handleChange}
                                value={inputText}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-2 text-end ps-0">
                          <a
                            className="btn bg-gradient-primary btn-sm mb-0 border-radius-xl"
                            style={{ height: "95%" }}
                            href="/radiografer-add-data-pasien"
                          >
                            <i className="fas fa-plus"></i>&nbsp;&nbsp;Tambah
                            Data
                          </a>
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
                                Tanggal Periksa
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Status
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
                                  <span className="text-secondary text-xs font-weight-bold">
                                    {moment(
                                      item.updated_at ?? item.created_at
                                    ).format("D-MM-YYYY")}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm">
                                  <span
                                    className={`badge border-radius-xl badge-sm bg-gradient-${
                                      item.panoramik_check_date === null
                                        ? "warning"
                                        : "success"
                                    }`}
                                  >
                                    {item.panoramik_check_date === null
                                      ? "Proses"
                                      : "Selesai"}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm pe-0 text-center">
                                  <Link
                                    to={`/radiografer-view-data-pasien/${item.id}`}
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

export default DataPasien;
