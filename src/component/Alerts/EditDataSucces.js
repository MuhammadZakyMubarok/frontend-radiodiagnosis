import React from "react";

const EditDataSucces = () => {
  return (
    <div>
      <div>
        <div
          class="alert alert-success text-sm p-2 alert-dismissible fade show mt-4"
          role="alert"
        >
          <i class="fa fa-check-circle-o" aria-hidden="true">
            {" "}{" "}
            Perubahan berhasil disimpan.
          </i>
        </div>
      </div>
    </div>
  );
};

export default EditDataSucces;
