import React from "react";

const SidebarFooterAdmin = () => {
  const logoutHandler = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login-admin";
  };

  return (
    <div>
      <div className="sidenav-footer mx-3 pt-7">
        <div className="card card-plain shadow-none" id="sidenavCard">
          <img
            className="w-50 mx-auto"
            src="../assets/img/illustrations/icon-documentation.svg"
            alt="sidebar_illustration"
          />
          <div className="card-body text-center p-3 w-100 pt-0">
            <div className="docs-info">
              <p className="text-xs font-weight-bold mb-0">Radiodiagnosis</p>
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-outline-danger btn-sm w-100 mb-3" onClick={logoutHandler}>
          Keluar
        </button>
      </div>
    </div>
  );
};

export default SidebarFooterAdmin
