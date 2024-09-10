import { React, useState, useEffect } from "react";
import HeaderUser from "../../../component/Header/HeaderUser";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import RadiografiPanoramikCardDokter from "../../../component/Card/RadiografiPanoramikCardDokter";
import axios from "axios";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import Paginations from "../../../component/Pagination/Paginations";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";

const RadiografiPanoramikDokter = () => {
  const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [inputText, setInputText] = useState("");
  const [statusSearch, setStatusSearch] = useState(false);
  const [verified, setVerified] = useState("");

  const handleChange = (event) => {
    setInputText(event.target.value);
    setStatusSearch(true);
  };

  const handleVerified = (val) => {
    setVerified(val);
  };

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    let url = `${baseURL}/radiographics/all?page=${currentPage}`;
    if (verified !== undefined && verified !== "") {
      url += `&verified=${verified}`;
    }
    if (inputText !== undefined && inputText !== "") {
      url += `&search=${inputText}`;
    }
    axios
      .get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "fail") {
          setData([]);
        } else {
          setData(response.data.data);
          setPagination(response.data.meta);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPage, inputText, verified]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  console.log(pagination)

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
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-header p-1">
                      <div className="row p-2">
                        <div className="col-9 card-header p-4 pt-3">
                          <h5 className="font-weight-bolder">
                            Radiografi Panoramik
                          </h5>
                          <p className="text-xs text-secondary mb-0">
                            Hasil diagnosa pada tabel di bawah merupakan hasil
                            diagnosa
                            <br />
                            sementara yang perlu diverifikasi oleh dokter
                          </p>
                        </div>
                        <div class="col-3 pe-3 pt-3">
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
                    <div className="card-body px-0 pt-0 pb-2">
                      <div className="row">
                        <di className="col-md-2">
                          <p className="btn btn-link m-0 ps-0  text-secondary text-xs font-weight-bold" onClick={() => handleVerified("")}>
                            Semua Hasil
                          </p>
                        </di>
                        <di className="col-md-2">
                          <button className="ps-0 btn btn-link m-0 text-secondary text-xs font-weight-bold" onClick={() => handleVerified("true")}>
                            Telah Diverifikasi
                          </button>
                        </di>
                        <di className="col-md-2">
                          <button className="btn btn-link m-0 ps-0  text-secondary text-xs font-weight-bold" onClick={() => handleVerified("false")}>
                            Belum Diverifikasi
                          </button>
                        </di>
                        <hr
                          style={{
                            height: "1px",
                            borderWidth: "0px",
                            color: "gray",
                            backgroundColor: "gray",
                            marginBottom: "0px",
                            marginTop: "0px",
                          }}
                        />
                      </div>
                    </div>
                    {/* <!-- </card> --> */}
                    <div className="row p-3 ">
                      {data.map((item) => (
                        <div
                          key={item.radiographics_id}
                          className="col-xl-4 col-sm-6 mb-xl-0 mb-4"
                        >
                          <RadiografiPanoramikCardDokter
                            data={item}
                            baseURL={baseURL}
                          />
                        </div>
                      ))}
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

export default RadiografiPanoramikDokter;
