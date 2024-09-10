import React from "react";

const ButtonVerifiedResult = ({index}) => {
  return (
    <div>
      <a
        className="btn btn-sm btn pe-0 ps-0 btn-warning w-50 shadow-none"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModalResult${index}`}
      >
        <img
          src="../assets/img/App/verification.png"
          className="w-10 h-1"
        ></img>
        &nbsp;&nbsp;Lihat Hasil Verifikasi
      </a>
    </div>
  );
};

export default ButtonVerifiedResult;
