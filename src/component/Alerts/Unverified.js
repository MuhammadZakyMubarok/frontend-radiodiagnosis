import React from "react";

const Unverified = () => {
  return (
    <div>
      <a className="text-warning text-xs mb-0" href="javascript:;">
        <i
          className="fa fa-exclamation-circle text-xs me-2"
          aria-hidden="true"
        ></i>
        Belum Diverifikasi
      </a>
    </div>
  );
};

export default Unverified;
