import axios from "axios";
import moment from "moment/moment";
import { React, useState, useEffect } from "react";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL } from "../../../routes/Config";
import { Link } from "react-router-dom";
import WithAuthorization from "../../../utils/auth";
import Paginations from "../../../component/Pagination/Paginations";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";

const CatatanPasien = () => {
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
    let url = `${baseURL}/radiographics/histories/all?page=${currentPage}`;
    if (inputText !== undefined) {
      url += `&search=${inputText}`;
    }
    if (inputText.length > 0) {
      axios
        .get(`${url}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.data) {
            // setData(response.data.data)
            setData(response.data.data);
            setPagination(response.data.meta);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      axios
        .get(`${baseURL}/radiographics/histories/all?page=${currentPage}`, {
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
    }
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
              <div className="row p-0">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-9 d-flex align-items-center">
                          <h5 className="mb-0 font-weight-bolder">
                            Catatan Pasien
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
                        {/* <div className="col-6 text-end">
                          <a
                            className="btn bg-gradient-primary btn-sm mb-0"
                            href="/dokter-add-catatan-pasien"
                          >
                            <i className="fas fa-plus"></i>&nbsp;&nbsp;Tambah
                            Catatan
                          </a>
                        </div> */}
                      </div>
                    </div>
                    <div className="card-body px-0 pt-0 pb-2 mt-2">
                      <div className="table-responsive p-0">
                        {data.length > 0 ? (
                          <table className="table align-items-center mb-0">
                            <thead>
                              <tr>
                                <th className="w-4 col-1 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0">
                                  Kode RM
                                </th>
                                <th className="col-3 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">
                                  Nama Pasien
                                </th>
                                <th className="col-4 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                  Dokter Verfikator
                                </th>
                                <th className="col-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                  Tanggal Verifikasi
                                </th>

                                <th className="col-2 text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-2 pe-0">
                                  Aksi
                                </th>
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
                                  <td className="align-middle text-start text-sm ps-4">
                                    <p className="text-xs text-secondary mb-0">
                                      {item.fullname}
                                    </p>
                                  </td>
                                  <td className="align-middle text-start text-sm ps-2">
                                    <p className="text-xs text-secondary mb-0">
                                      {item.doctor_name ?? "-"}
                                    </p>
                                  </td>
                                  <td className="align-middle text-start text-sm ps-2">
                                    <p className="text-xs text-secondary mb-0">
                                      {item.panoramik_check_date !== null
                                        ? moment(
                                            item.panoramik_check_date
                                          ).format("DD/MM/YYYY")
                                        : "-"}
                                    </p>
                                  </td>
                                  <td className="align-middle text-sm">
                                    <Link
                                      to={`/dokter-detail-catatan-pasien/${item.history_id}`}
                                    >
                                      <span className="btn mt-2 mb-2 shadow-none badge text-secondary badge-sm bg-gradient-white border border-gray">
                                        Lihat Detail
                                      </span>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <center>Belum ada data</center>
                        )}
                      </div>
                    </div>
                  </div>
                  <Paginations
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
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

export default CatatanPasien;
