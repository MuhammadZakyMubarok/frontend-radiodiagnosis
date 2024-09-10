import axios from "axios";
import { React, useState, useEffect } from "react";
import HeaderAdmin from "../../component/Header/HeaderAdmin";
import DeleteModal from "../../component/Modal/DeleteModal";
import SidebarAdmin from "../../component/Sidebar/SidebarAdmin";
import { baseURL } from "../../routes/Config";
import { Link } from "react-router-dom";
import WithAuthorization from "../../utils/auth";
import Paginations from "../../component/Pagination/Paginations";

const DataUser = () => {
  const auth = WithAuthorization(["admin"]);

  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [inputText, setInputText] = useState("");
  const [statusSearch, setStatusSearch] = useState(false);
  const [doctor, setDoctor] = useState(0);
  const [radiographer, setRadiographer] = useState(0);

  const handleChange = event => {
    setInputText(event.target.value);
    setStatusSearch(true);
  };
  
  let startIndex = (currentPage - 1) * 10;
  const token = sessionStorage.getItem("token");
  // get data user use axios
  useEffect(() => {
    if(inputText.length > 0) {
      axios.get(`${baseURL}/users/all?page=${currentPage}&search=${inputText}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        if (response.data.data) {
          // setData(response.data.data)
          setSearchData(response.data.data)
          setPagination(response.data.meta)
          setDoctor(response.data.meta.doctor)
          setRadiographer(response.data.meta.radiographer);
          console.log(response.data.meta)
        }
      })
      .catch((error) => {
        console.log(error.response.data)
      })
    }
    else {
      setStatusSearch(false);
      setSearchData([]);
      axios
      .get(`${baseURL}/users/all?page=${currentPage}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          setData(response.data.data);
          setPagination(response.data.meta);
          setDoctor(response.data.meta.doctor)
          setRadiographer(response.data.meta.radiographer);
          console.log(response.data.meta)
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });

      // axios
      // .get(`${baseURL}/users/all}`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // })
      // .then((response) => {
      //   if (response.data.data) {
      //     // setData(response.data.data);
      //     // setPagination(response.data.meta);
      //     console.log("banyak data user : " + response.data.length);
      //   }
      //   console.log("data user : " + response);
      //   console.log("data user");
      // })
      // .catch((error) => {
      //   console.log(error)
      // });
    }
  }, [currentPage, inputText]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // END COUNT

  const handleDelete = async (e, userId) => {
    e.preventDefault();
    await axios
      .delete(`${baseURL}/users/delete/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
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
            <SidebarAdmin />
          </aside>
          <main className="main-content position-relative border-radius-lg">
            <HeaderAdmin />
            <div className="container-fluid py-2">
              <div className="row">
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 ">
                  <div className="card">
                    <div className="card-body p-3">
                      <div className="row ">
                        <div className="col-8 ">
                          <div className="numbers ">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              User
                            </p>
                            <h2 className="font-weight-bolder d-flex justify-content-left">
                              {doctor}
                            </h2>
                            <p className="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Jumlah Dokter Gigi
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
                        <div className="col-8 ">
                          <div className="numbers ">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold d-flex justify-content-left">
                              User
                            </p>
                            <h2 className="font-weight-bolder d-flex justify-content-left">
                              {radiographer}
                            </h2>
                            <p className="text-sm mb-0  font-weight-bold d-flex justify-content-left">
                              Jumlah Radiografer
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
              </div>
              <div className="row mt-4 mb-2">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header pb-0 p-4">
                      <div className="row">
                        <div className="col-7 d-flex align-items-center">
                          <h5 className="mb-0 font-weight-bolder">Data User</h5>
                        </div>
                        <div class="col-3 text-end pe-0">
                          <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div class="input-group">
                              <span class="input-group-text text-body border-radius-xl">
                                <i class="fas fa-search" aria-hidden="true"></i>
                              </span>
                              <input
                                type="text"
                                class="form-control border-radius-xl"
                                size="50"
                                placeholder="Nama User, NIP..."
                                style={{height:"80%"}}
                                onChange={handleChange}
                                value={inputText}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-2 text-end">
                          <a
                            className="btn bg-gradient-primary btn-sm mb-0 border-radius-xl"
                            style={{ height: "95%" }}
                            href="/add-data-user"
                          >
                            <i className="fas fa-plus"></i>&nbsp;&nbsp;Tambah
                            Data
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body px-0 pb-2 ">
                      <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0 ">
                          <thead className="table-light">
                            <tr>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 pe-0">
                                Kode User
                              </th>
                              <th className="text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-2 pe-0">
                                Nama Lengkap
                              </th>
                              <th className="text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-0">
                                NIP
                              </th>

                              <th className="text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-0 ">
                                Email
                              </th>
                              <th className="text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-0">
                                Profesi
                              </th>
                              <th className="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7 ps-2 ">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {statusSearch == true ?
                              searchData.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="ps-0 align-middle text-center ">
                                    <span className="text-xs text-secondary mb-0">
                                      {startIndex + index + 1}
                                    </span>
                                  </td>
                                  <td className="align-middle text-start text-sm ps-2 pe-0">
                                    <span className="text-xs text-secondary mb-0 ">
                                      {item.fullname}
                                    </span>
                                  </td>
                                  <td className="align-middle text-start text-sm ps-0">
                                    <span className="text-xs text-secondary mb-0">
                                      {item.nip}
                                    </span>
                                  </td>
                                  <td className="align-middle text-start ps-0">
                                    <span className="text-secondary text-xs font-weight-bold">
                                      {item.email}
                                    </span>
                                  </td>
                                  <td className="align-middle text-start ps-0">
                                    <span className="text-secondary text-xs font-weight-bold">
                                      {item.role}
                                    </span>
                                  </td>
                                  <td className="align-middle text-center text-sm pe-0">
                                    <span className="text-xs text-secondary mb-0 ">
                                      <div>
                                        <Link
                                          className="btn btn-outline-primary btn-sm mb-0 me-2 pt-1 pb-1 ps-2 pe-2 text-primary"
                                          to={`/edit-data-user/${item.id}`}
                                        >
                                          <i className="fa fa-pencil text-primary"></i>
                                        </Link>
                                        <button
                                          type="button"
                                          className="btn btn-outline-danger btn-sm mb-0 me-2 pt-1 pb-1 ps-2 pe-2 text-danger"
                                          data-bs-toggle="modal"
                                          data-bs-target="#exampleModal"
                                        >
                                          <i className="fa fa-trash text-danger"></i>
                                        </button>
                                        <Link
                                          to={`/view-data-user/${item.id}`}
                                          className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-secondary"
                                        >
                                          <i className="fa fa-eye text-secondary"></i>
                                        </Link>
                                        <DeleteModal
                                          userId={item.id}
                                          handleDelete={handleDelete}
                                        />
                                      </div>
                                    </span>
                                  </td>
                                </tr>
                              ))
                             : 
                             data.map((item, index) => (
                              <tr key={item.id}>
                                <td className="ps-0 align-middle text-center ">
                                  <span className="text-xs text-secondary mb-0">
                                    {startIndex + index + 1}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm ps-2 pe-0">
                                  <span className="text-xs text-secondary mb-0 ">
                                    {item.fullname}
                                  </span>
                                </td>
                                <td className="align-middle text-start text-sm ps-0">
                                  <span className="text-xs text-secondary mb-0">
                                    {item.nip}
                                  </span>
                                </td>
                                <td className="align-middle text-start ps-0">
                                  <span className="text-secondary text-xs font-weight-bold">
                                    {item.email}
                                  </span>
                                </td>
                                <td className="align-middle text-start ps-0">
                                  <span className="text-secondary text-xs font-weight-bold">
                                    {item.role}
                                  </span>
                                </td>
                                <td className="align-middle text-center text-sm pe-0">
                                  <span className="text-xs text-secondary mb-0 ">
                                    <div>
                                      <Link
                                        className="btn btn-outline-primary btn-sm mb-0 me-2 pt-1 pb-1 ps-2 pe-2 text-primary"
                                        to={`/edit-data-user/${item.id}`}
                                      >
                                        <i className="fa fa-pencil text-primary"></i>
                                      </Link>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm mb-0 me-2 pt-1 pb-1 ps-2 pe-2 text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#exampleModal${item.id}`}
                                      >
                                        <i className="fa fa-trash text-danger"></i>
                                      </button>
                                      <Link
                                        to={`/view-data-user/${item.id}`}
                                        className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2 text-secondary"
                                      >
                                        <i className="fa fa-eye text-secondary"></i>
                                      </Link>
                                      <DeleteModal
                                        userId={item.id}
                                        handleDelete={handleDelete}
                                      />
                                    </div>
                                  </span>
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

export default DataUser;
