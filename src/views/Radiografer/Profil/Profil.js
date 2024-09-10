import axios from "axios";
import { React, useState, useEffect } from "react";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import Kontak from "./Kontak";
import UbahPassword from "./UbahPassword";
import ViewProfil from "./ViewProfil";
import WithAuthorization from "../../../utils/auth";

const Profil = () => {
  const auth = WithAuthorization(["radiographer"]);

  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${baseURL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.data) {
            setData(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();
  }, []);

  const token = sessionStorage.getItem("token");

  if(auth) {
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
                    <div className="card-header pb-2 p-4 ">
                      <ul
                        className="nav nav-pills mb-3"
                        id="pills-tab"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="pills-biodata-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-biodata"
                            type="button"
                            role="tab"
                            aria-controls="pills-biodata"
                            aria-selected="true"
                          >
                            Data Diri
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-password-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-password"
                            type="button"
                            role="tab"
                            aria-controls="pills-password"
                            aria-selected="false"
                          >
                            Ubah Password
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Kontak
                          </button>
                        </li>
                      </ul>
                      <div className="tab-content" id="pills-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="pills-biodata"
                          role="tabpanel"
                          aria-labelledby="pills-biodata-tab"
                        >
                          {data ? (
                            <ViewProfil auth={data} token={token} />
                          ) : (
                            <p>Loading data ...</p>
                          )}
                        </div>
                        <div
                          className="tab-pane fade"
                          id="pills-password"
                          role="tabpanel"
                          aria-labelledby="pills-password-tab"
                        >
                          {data ? (
                            <UbahPassword token={token} />
                          ) : (
                            <p>Loading data ...</p>
                          )}
                        </div>
                        <div
                          className="tab-pane fade "
                          id="pills-contact"
                          role="tabpanel"
                          aria-labelledby="pills-contact-tab"
                        >
                          {data ? (
                            <Kontak auth={data} />
                          ) : (
                            <p>Loading data ...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </body>
      </div>
    );
  } else {
    return <div></div>
  }
};

export default Profil;
