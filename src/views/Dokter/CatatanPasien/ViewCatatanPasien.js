import axios from "axios";
import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import DeleteModal from "../../../component/Modal/DeleteModal";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import Paginations from "../../../component/Pagination/Paginations";

const ViewCatatanPasien = () => {
  const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState({});
  const [manualInterpretation, setManualInterpretation] = useState({
    manualInterpretation: "",
  });

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`${baseURL}/radiographics/history/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.data) {
            setData(response.data.data);
            setManualInterpretation({
              manualInterpretation: response.data.data.manual_interpretation,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setManualInterpretation({
      ...manualInterpretation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${baseURL}/radiographics/edit/${id}/interpretation`,
        manualInterpretation,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.href = `/dokter-detail-catatan-pasien/${id}`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    axios
      .put(
        `${baseURL}/radiographics/delete/${id}/interpretation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.href = `/dokter-detail-catatan-pasien/${id}`;
      })
      .catch((error) => {
        console.log(error);
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
                        <div className="col-8 d-flex align-items-center">
                          <button className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2">
                            {" "}
                            <Link to={`/dokter-detail-catatan-pasien/${id}`}>
                              <i
                                className="fa fa-arrow-left"
                                aria-hidden="true"
                              ></i>
                              &nbsp;&nbsp;Kembali
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-9 d-flex align-items-center mt-2 ms-4">
                      <h6 className="mb-0 font-weight-bolder">
                        Catatan Pasien
                      </h6>
                    </div>
                    <div className="card-body px-0 pb-2 ">
                      <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0 ">
                          <thead className="">
                            <tr>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 pe-0">
                                No.
                              </th>
                              <th className="text-uppercase text-secondary text-start text-xxs font-weight-bolder opacity-7 ps-2 pe-0">
                                Catatan Pasien
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center ">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="ps-2 align-middle ">
                                <span className="text-xs text-secondary mb-0">
                                  1
                                </span>
                              </td>
                              <td className="align-middle text-start text-sm ps-2 pe-0">
                                <span className="text-xs text-secondary mb-0 ">
                                  pada gigi nomor 52 merupakan penyakit resorbsi
                                </span>
                              </td>

                              <td className="align-middle text-center text-sm pe-0">
                                <span className="text-xs text-secondary mb-0 ">
                                  <div>
                                    <Link
                                      className="btn btn-outline-primary btn-sm mb-0 me-2 pt-1 pb-1 ps-2 pe-2 text-primary"
                                      onClick={handleSubmit}
                                    >
                                      <i className="fa fa-pencil text-primary"></i>
                                    </Link>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm mb-0 me-2 pt-1 pb-1 ps-2 pe-2 text-danger"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#exampleModal${id}`}
                                    >
                                      <i className="fa fa-trash text-danger"></i>
                                    </button>
                                    <DeleteModal
                                      userId={id}
                                      handleDelete={handleDelete}
                                    />
                                  </div>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>  
                      </div>
                 
                    </div>
                  </div>
                </div>
              </div>
              <Paginations/>
            </div>
          </main>
        </body>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ViewCatatanPasien;
