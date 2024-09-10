import axios from "axios";
import { React, useState, useEffect } from "react";
import { baseURL } from "../../routes/Config";

const HeaderUser = () => {
  const [data, setData] = useState({});

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${baseURL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <body className="g-sidenav-show bg-gray-100">
        <div className="min-height-300 bg-primary position-absolute w-100"></div>
        <main className="main-content position-relative border-radius-lg">
          {/* <!-- Navbar --> */}
          <nav
            className="navbar navbar-main navbar-expand-lg shadow-none border-radius-xl px-0"
            id="navbarBlur"
            data-scroll="false"
          >
            <div className="container-fluid py-1 px-0">
              <nav aria-label="breadcrumb">
                <div
                  className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                  id="navbar"
                >
                  <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                    <div className="input-group">
                      <span className="input-group-text text-body border-radius-xl">
                        <i className="fas fa-search" aria-hidden="true"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-radius-xl"
                        size="50"
                        placeholder="Cari berdasarkan nama dan kode pasien..."
                      />
                    </div>
                  </div>
                </div>
              </nav>
              <div
                className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                id="navbar"
              >
                <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                  <ul className="navbar-nav justify-content-end">
                    <li className="nav-item d-flex align-items-center">
                      <a
                        href="javascript:;"
                        className="nav-link text-white font-weight-bold px-0"
                      >
                        <div className="d-flex px-2 py-1">
                          <div className="d-flex flex-column justify-content-end">
                            <h6 className="mb-0 text-sm text-white d-flex justify-content-end">{data.fullname}</h6>
                            <p className="text-xs text-white mb-0 d-flex justify-content-end">
                              {data.role}
                            </p>
                          </div>
                          <div className="ps-2">
                            <img
                              src={`${baseURL + data.profile_picture}`}
                              className="avatar avatar-sm me-0 "
                              alt="user1"
                            />
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                      <a
                        href="javascript:;"
                        className="nav-link text-white p-0"
                        id="iconNavbarSidenav"
                      >
                        <div className="sidenav-toggler-inner">
                          <i className="sidenav-toggler-line bg-white"></i>
                          <i className="sidenav-toggler-line bg-white"></i>
                          <i className="sidenav-toggler-line bg-white"></i>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
          {/* <!-- End Navbar --> */}
        </main>
      </body>
    </div>
  );
};

export default HeaderUser;
