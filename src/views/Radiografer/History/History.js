import axios from "axios";
import { React, useState, useEffect } from "react";
import HeaderUser from "../../../component/Header/HeaderUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import { Link } from "react-router-dom";
import WithAuthorization from "../../../utils/auth";
import Paginations from "../../../component/Pagination/Paginations";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";

const History = () => {
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

  useEffect(() => {
    let url = `${baseURL}/radiographics/histories/all?page=${currentPage}`;
    if (inputText !== "") {
      url += `&search=${inputText}`;
    }
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
          console.log(data)
        }
      })
      .catch((error) => {
        console.log(error.response.data);
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
            <SidebarRadiografer />
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
                            History Pasien
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
                      <div className="card-body ps-0 pe-0 pt-0 pb-2 mt-2">
                        <div className="table-responsive p-0">
                          {data.length > 0 ? (
                            <table className="table align-items-center mb-0">
                              <thead>
                                <tr>
                                  <th className="w-4 col-1 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-0 pe-0">
                                    Kode RM
                                  </th>
                                  <th className="col-8 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">
                                    Nama Pasien
                                  </th>

                                  <th className="col-2 text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-2 pe-0">
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
                                    <td className="align-middle text-start text-sm ps-4">
                                      <p className="text-xs text-secondary mb-0">
                                        {item.fullname}
                                      </p>
                                    </td>

                                    <td className="align-middle text-sm">
                                      <Link
                                        to={`/radiografer-view-history/${item.history_id}`}
                                      >
                                        <span className="btn mt-2 mb-2 shadow-none badge text-secondary badge-sm bg-gradient-white border border-gray">
                                          Lihat History Pasien
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

export default History;
