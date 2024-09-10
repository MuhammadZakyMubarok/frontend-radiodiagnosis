import React from "react";

const UploadGambarError = () => {
  return (
    <div>
      <div
        class="alert alert-danger text-sm p-2 alert-dismissible fade show mt-4"
        role="alert"
      >
        <i class="fa fa-times-circle-o" aria-hidden="true">
          {" "}{" "}
          Silahkan masukkan gambar dahulu.
        </i>
      </div>
    </div>
  );
};

export default UploadGambarError;
