import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import HeaderDataUser from "../../component/Header/HeaderDataUser";
import SidebarPatient from "../../component/Sidebar/SidebarPatient";
import Paginations from "../../component/Pagination/Paginations";
import HeaderAdmin from "../../component/Header/HeaderAdmin";
import WithAuthorization from "../../utils/auth";

// Data dummy untuk pasien
const dummyData = [
  {
    id: 1,
    medic_number: "RM001",
    fullname: "Jane Doe",
    radiographer: "Dr. Smith",
    updated_at: "2024-08-04T12:00:00Z",
    panoramik_check_date: null,
  },
  {
    id: 2,
    medic_number: "RM002",
    fullname: "John Doe",
    radiographer: "Dr. Jones",
    updated_at: "2024-08-03T12:00:00Z",
    panoramik_check_date: "2024-08-03",
  },
  // Tambahkan data dummy lainnya sesuai kebutuhan
];

const dummyPagination = {
  total: dummyData.length,
  verified: dummyData.filter((item) => item.panoramik_check_date).length,
  thisDay: dummyData.filter((item) =>
    moment(item.updated_at).isSame(new Date(), "day")
  ).length,
  thisMonth: dummyData.filter((item) =>
    moment(item.updated_at).isSame(new Date(), "month")
  ).length,
  totalPages: 1, // Ubah sesuai kebutuhan
};

const DashboardPatient = () => {

    return (
      <div className="g-sidenav-show bg-gray-100">
        <div className="min-height-300 bg-primary position-absolute w-100"></div>
        <aside
          className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
          id="sidenav-main"
        >
          <SidebarPatient />
        </aside>

        <body className="g-sidenav-show bg-gray-100">
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
                              6
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
                              3
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
                              4
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
            </div>
          </main>
        </body>
      </div>
    );
};

export default DashboardPatient;
