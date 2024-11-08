import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import HeaderDataUser from "../../component/Header/HeaderDataUser";
import SidebarPatient from "../../component/Sidebar/SidebarPatient";
import Paginations from "../../component/Pagination/Paginations";
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

const HistoryPatient = () => {
  const auth = WithAuthorization(["patient"]);

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [inputText, setInputText] = useState("");
  const [statusSearch, setStatusSearch] = useState(false);

  const handleChange = (event) => {
    setInputText(event.target.value);
    setStatusSearch(true);
  };

  useEffect(() => {
    // Menggunakan data dummy alih-alih fetching data dari API
    const filteredData = dummyData.filter((item) =>
      item.fullname.toLowerCase().includes(inputText.toLowerCase())
    );
    setData(filteredData);
    setPagination(dummyPagination);
  }, [inputText, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <div className="row p-0">
              <div className="col-12">
                <div className="card mb-4">
                  <div>
                    <div className="card-body px-0 pb-2 mt-2">
                      <div className="row justify-content-center">
                        <div className="col-md-6">
                          <div className="card shadow-none border-0">
                            {/* isi disini */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default HistoryPatient;
