import axios from "axios";
import moment from "moment";
import JsPDF from "jspdf";
import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import PaginationsHistory from "../../../component/Pagination/PaginationsHistory";
import Report from "./Report";
import ReactPDF from "@react-pdf/renderer";
import ReactDOM from "react-dom";
import { PDFViewer } from "@react-pdf/renderer";

// ReactPDF.renderToStream(<MyDocument />);

// const App = () => (
//   <PDFViewer>
//     <MyDocument />
//   </PDFViewer>
// );

// ReactDOM.render(<App />, document.getElementById('root'));

const DetailCatatanPasien = () => {
  const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState({});
  const [system, setSystem] = useState([]);
  const [manual, setManual] = useState([]);
  const [verificator, setVerificator] = useState([]);

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
        if (response.data.data) {
          setData(response.data.data);
          mappingDiagnoses(response.data.data.diagnoses);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const generatePDF = () => {
    const report = new JsPDF("portrait", "pt", "a4");
    report.html(document.querySelector("#report")).then(() => {
      report.save("report.pdf");
    });
  };

  // Create styles
  // const styles = StyleSheet.create({
  //   page: {
  //     flexDirection: "row",
  //     backgroundColor: "#E4E4E4",
  //   },
  //   section: {
  //     margin: 10,
  //     padding: 10,
  //     flexGrow: 1,
  //   },
  // });

  // Create Document Component
  // const MyDocument = () => (
  //   <Document>
  //     <Page size="A4" style={styles.page}>
  //       <View style={styles.section}>
  //         <Text>Section #1</Text>
  //       </View>
  //       <View style={styles.section}>
  //         <Text>Section #2</Text>
  //       </View>
  //     </Page>
  //   </Document>
  // );

  const mappingDiagnoses = (diagnoses) => {
    let systemDiagnosis = [];
    let manualDiagnosis = [];
    let verificatorDiagnosis = [];

    diagnoses.map((diagnosis) => {
      systemDiagnosis.push({
        tooth: diagnosis.tooth_number,
        diagnosis: diagnosis.system_diagnosis,
      });

      manualDiagnosis.push({
        tooth: diagnosis.tooth_number,
        diagnosis: diagnosis.manual_diagnosis,
      });

      verificatorDiagnosis.push({
        tooth: diagnosis.tooth_number,
        diagnosis: diagnosis.verificator_diagnosis,
      });
    });

    setSystem(systemDiagnosis);
    setManual(manualDiagnosis);
    setVerificator(verificatorDiagnosis);
  };

  console.log(data);

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
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/dokter-catatan-pasien"
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

                    <div className="card-body ps-0 pb-2 pt-0 pe-3">
                      <div className="row">
                        <div className="col pe-0">
                          <div className="card-header pb-0">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 font-weight-bolder">
                                Detail Catatan Pasien
                              </h6>
                            </div>
                            <div className="row mt-3">
                              <div className="col-2">
                                <p className="text-xs text-secondary mb-1">
                                  Kode Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.medic_number}
                                </p>
                              </div>
                              <div className="col-2">
                                <p className="text-xs text-secondary mb-1">
                                  Nama Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.fullname}
                                </p>
                              </div>
                              <div className="col-4">
                                <p className="text-xs text-secondary mb-1">
                                  Tanggal Verifikasi
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.panoramik_check_date !== null
                                    ? moment(data.panoramik_check_date).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "-"}
                                </p>
                              </div>

                              <div className="col-4 ps-3 text-end">
                                <div className="d-flex justify-content-end mb-0 text-end">
                                  <button
                                    className="btn btn-primary btn-sm mb-0"
                                    onClick={generatePDF}
                                  >
                                    Export PDF
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <hr
                            style={{
                              height: "1px",
                              borderWidth: "0 px",
                              color: "gray",
                              backgroundColor: "gray",
                              marginBottom: "0 px",
                            }}
                          />

                          <div className="card-body pb-2 pt-0">
                            <div className="row justify-content-center">
                              <div className="col-md-12">
                                <div
                                  className="card shadow-none mt-2"
                                  style={{ backgroundColor: "ghostwhite" }}
                                >
                                  <div className="row d-flex justify-content-center mt-4 mb-4">
                                    <div className="col-8">
                                      <div className="card shadow-none mt-4 me-2 ms-2">
                                        <div className="card-body">
                                          <p className="text-sm font-weight-bolder text-dark">
                                            Rekam Medik
                                          </p>
                                          <p class="text-xs text-secondary font-weight-bold">
                                            Gambar Panoramik Gigi
                                          </p>
                                          <img
                                            className=" img-fluid ps-0 pb-4 border-radius-xl"
                                            // style={{borderBottomLeftRadius:"1rem" }}
                                            src={`${
                                              baseURL + data.panoramik_picture
                                            }`}
                                          />
                                          <div className="row">
                                            <div className="col-3">
                                              <p className="text-xs text-secondary font-weight-bold">
                                                Tanggal Verifikasi
                                              </p>
                                            </div>
                                            <div className="col-4">
                                              <p className="text-xs text-primary font-weight-bold">
                                                {data.panoramik_check_date !==
                                                null
                                                  ? moment(
                                                      data.panoramik_check_date
                                                    ).format("DD/MM/YYYY")
                                                  : "-"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-3">
                                              <p className="text-xs text-secondary font-weight-bold">
                                                Dokter Verifikator
                                              </p>
                                            </div>
                                            <div className="col-4">
                                              <p className="text-xs text-primary font-weight-bold">
                                                {data.doctor_name ?? "-"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="row mt-4">
                                            <div className="col-12">
                                              <p className="text-xxs text-secondary font-weight-bold">
                                                Radiodiagnosis Sistem
                                              </p>
                                              {data.diagnoses?.map(
                                                (diagnose) => {
                                                  if (
                                                    diagnose?.system_diagnosis
                                                  ) {
                                                    return (
                                                      <div className="row">
                                                        <div className="col-2">
                                                          <ul className="ps-3">
                                                            <li className="text-xs">
                                                              Gigi #
                                                              {
                                                                diagnose?.tooth_number
                                                              }
                                                            </li>
                                                          </ul>
                                                        </div>
                                                        <div className="col-10 ps-0">
                                                          <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                                            {
                                                              diagnose?.system_diagnosis
                                                            }
                                                          </p>
                                                          <hr
                                                            style={{
                                                              height: "1px",
                                                              borderWidth:
                                                                "0 px",
                                                              color: "gray",
                                                              backgroundColor:
                                                                "gray",
                                                              marginBottom:
                                                                "0 px",
                                                              marginTop: "0 px",
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                }
                                              )}
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-12">
                                              <p className="text-xxs text-secondary font-weight-bold">
                                                Radiodiagnosis Verifikator
                                              </p>
                                              {data.diagnoses?.map(
                                                (diagnose) => {
                                                  if (
                                                    diagnose?.system_diagnosis ||
                                                    diagnose?.manual_diagnosis
                                                  ) {
                                                    return (
                                                      <div className="row">
                                                        <div className="col-2">
                                                          <ul className="ps-3">
                                                            <li className="text-xs">
                                                              Gigi #
                                                              {
                                                                diagnose?.tooth_number
                                                              }
                                                            </li>
                                                          </ul>
                                                        </div>
                                                        <div className="col-10 ps-0">
                                                          {diagnose.verificator_diagnosis ? (
                                                            <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                                              {diagnose.verificator_diagnosis ===
                                                              "dan lain-lain"
                                                                ? diagnose.verificator_note +
                                                                  (diagnose.manual_diagnosis
                                                                    ? ", " +
                                                                      diagnose.manual_diagnosis
                                                                    : "")
                                                                : diagnose.verificator_diagnosis
                                                                ? diagnose.verificator_diagnosis +
                                                                  (diagnose.manual_diagnosis
                                                                    ? ", " +
                                                                      diagnose.manual_diagnosis
                                                                    : "")
                                                                : diagnose.manual_diagnosis}
                                                            </p>
                                                          ) : (
                                                            <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                                              {diagnose.system_diagnosis
                                                                ? diagnose.system_diagnosis +
                                                                  (diagnose.manual_diagnosis
                                                                    ? ", " +
                                                                      diagnose.manual_diagnosis
                                                                    : "")
                                                                : diagnose.manual_diagnosis}
                                                            </p>
                                                          )}
                                                          <hr
                                                            style={{
                                                              height: "1px",
                                                              borderWidth:
                                                                "0 px",
                                                              color: "gray",
                                                              backgroundColor:
                                                                "gray",
                                                              marginBottom:
                                                                "0 px",
                                                              marginTop: "0 px",
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                }
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div id="report" style={{display: "none"}}>
                                          <Report />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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
        </body>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default DetailCatatanPasien;
