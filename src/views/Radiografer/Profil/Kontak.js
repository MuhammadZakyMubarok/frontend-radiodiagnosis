import { React, useState } from "react";
import ContactAlert from "../../../component/Alerts/ContactAlert";

const Kontak = ({ auth }) => {
  return (
    <div>
      <div className="card-body px-0 pb-2 mt-2">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-none border-0">
              <div className="card-header pb-0">
                <div className="d-flex align-items-center">
                  <h6 className="mb-0 font-weight-bolder">Kontak</h6>
                </div>
              </div>
              <div className="card-body pt-2">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="email" className="form-control-label">
                        Email
                      </label>
                      <p className="form-control" type="text">
                        {auth.email}
                      </p>
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="phone_number"
                        className="form-control-label"
                      >
                        Nomor Telepon
                      </label>
                      <p className="form-control" type="text">
                        {auth.phone_number}
                      </p>
                    </div>
                    <div className="form-group">
                      <div className=" text-center ">
                        <ContactAlert />
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
  );
};

export default Kontak;
