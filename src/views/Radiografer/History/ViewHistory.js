import axios from "axios";
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HistoryCard from "../../../component/Card/HistoryCard";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarRadiografer from "../../../component/Sidebar/SidebarRadiografer";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import PaginationsHistory from "../../../component/Pagination/PaginationsHistory";

const ViewHistory = () => {
  const auth = WithAuthorization(["radiographer"]);

  const [data, setData] = useState({});

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${baseURL}/radiographics/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "fail") {
          setData({});
        } else {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

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
                        <div className="col-8 d-flex align-items-center">
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/radiografer-history"
                          >
                            <i
                              className="fa fa-arrow-left"
                              aria-hidden="true"
                            ></i>
                            &nbsp;&nbsp;Kembali
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="card-body px-0 pb-2 pt-0 pe-3 pl-0">
                      <div className="row">
                        <div className="col pe-0">
                          <div className="card-header pb-2 ps-0">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 font-weight-bolder">
                                Detail History Pasien
                              </h6>
                            </div>
                            <div className="row mt-3">
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Kode RM
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.medic_number}
                                </p>
                              </div>
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Nama Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.fullname}
                                </p>
                              </div>
                            </div>
                          </div>
                          <hr
                            style={{
                              height: "1px",
                              borderWidth: "0px",
                              color: "gray",
                              backgroundColor: "gray",
                              marginBottom: "0px",
                              marginTop: "0px",
                              marginStart: "0px",
                            }}
                          />

                          <div className="card-body pb-2 pt-0">
                            <div className="row justify-content-center">
                              <div className="col-md-12">
                                <HistoryCard data={data} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <PaginationsHistory/>
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

export default ViewHistory;
