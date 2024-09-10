import React from "react";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import WithAuthorization from "../../../utils/auth";

const EditCatatanPasien = () => {
  const auth = WithAuthorization(["doctor"]);

  if(auth) {
    return (
      <div>
        <body class="g-sidenav-show bg-gray-100">
          <div class="min-height-300 bg-primary position-absolute w-100"></div>
          <aside
            class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-0 my-0 fixed-start ms-0"
            id="sidenav-main"
          >
            <SidebarDokter />
          </aside>
          <main class="main-content position-relative border-radius-lg">
            <HeaderDataUser />
            <div class="container-fluid py-2">
              <div class="row p-0">
                <div class="col-12">
                  <div class="card mb-4">
                    <div class="card-header pb-2 p-4">
                      <div class="row">
                        <div class="col-8 d-flex align-items-center">
                          <a
                            class="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/dokter-detail-catatan-pasien"
                          >
                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                            &nbsp;&nbsp;Kembali
                          </a>
                        </div>
                      </div>
                    </div>
  
                    <div class="card-body px-0 pb-2 pt-0">
                      <div class="row justify-content-center">
                        <div class="col-md-6">
                          <div class="card shadow-none border-0">
                            <div class="card-header pb-0">
                              <div class="d-flex align-items-center">
                                <h6 class="mb-0 font-weight-bolder">
                                  Edit Catatan Pasien
                                </h6>
                              </div>
                            </div>
  
                            <div class="card-body pt-3">
                              <div class="row">
                                <div class="col">
                                  <div class="form-group">
                                    <label
                                      for="example-text-input"
                                      class="form-control-label text-secondary"
                                    >
                                      Catatan Pasien
                                    </label>
                                    <textarea
                                      class="form-control"
                                      style={{ height: "20rem" }}
                                      type="text"
                                      placeholder="Masukkan catatan pasien"
                                      value=""
                                    ></textarea>
                                  </div>
                                  <div class="d-flex justify-content-end mt-4">
                                    <a href="">
                                      <button class="btn btn-primary btn-sm ms-auto">
                                        Simpan Perubahan
                                      </button>
                                    </a>
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
    return <div></div>
  }
};

export default EditCatatanPasien;
