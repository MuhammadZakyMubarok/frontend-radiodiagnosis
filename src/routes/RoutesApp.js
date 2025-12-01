import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAdmin from "../auth/LoginAdmin";
import LoginUser from "../auth/LoginUser";
import AddDataUser from "../views/Admin/AddDataUser";
import DataUser from "../views/Admin/DataUser";
import { EditDataUser } from "../views/Admin/EditDataUser";
import { ViewDataUser } from "../views/Admin/ViewDataUser";
import CatatanPasien from "../views/Dokter/CatatanPasien/CatatanPasien";
import DetailCatatanPasien from "../views/Dokter/CatatanPasien/DetailCatatanPasien";
import EditCatatanPasien from "../views/Dokter/CatatanPasien/EditCatatanPasien";
import ViewCatatanPasien from "../views/Dokter/CatatanPasien/ViewCatatanPasien";
import DataPasienDokter from "../views/Dokter/DataPasien/DataPasienDokter";
import ViewDataPasienDokter from "../views/Dokter/DataPasien/ViewDataPasienDokter";
import ProfilDokter from "../views/Dokter/Profil/ProfilDokter";
import Odontogram from "../views/Dokter/Odontogram/OdontogramPasien";
import RadiografiPanoramikDokter from "../views/Dokter/RadiografiPanoramik/RadiografiPanoramikDokter";
import ViewGambarPanoramikDokter from "../views/Dokter/RadiografiPanoramik/ViewGambarPanoramikDokter";
import AddDataPasien from "../views/Radiografer/DataPasien/AddDataPasien";
import DataPasien from "../views/Radiografer/DataPasien/DataPasien";
import EditDataPasien from "../views/Radiografer/DataPasien/EditDataPasien";
import ViewDataPasien from "../views/Radiografer/DataPasien/ViewDataPasien";
import History from "../views/Radiografer/History/History";
import ViewHistory from "../views/Radiografer/History/ViewHistory";
import Profil from "../views/Radiografer/Profil/Profil";
import RadiografiPanoramik from "../views/Radiografer/RadiografiPanoramik/RadiografiPanoramik";
import UploadGambarPanoramik from "../views/Radiografer/RadiografiPanoramik/UploadGambarPanoramik";
import UploadUlangGambarPanoramik from "../views/Radiografer/RadiografiPanoramik/UploadUlangGambarPanoramik";
import ViewGambarPanoramik from "../views/Radiografer/RadiografiPanoramik/ViewGambarPanoramik";


// Satu Sehat
import ViewSatuSehatPatient  from "../views/SatuSehat/Patient/ViewSatuSehatPatient";

// Import untuk ProfilePatient dan ResultDataDiagnosis
import ProfilePatient from "../views/Patient/ProfilePatient";
import ResultDataDiagnosis from "../views/Patient/ResultDataDiagnosis";
import HistoryPatient from "../views/Patient/HistoryPatient";
import DashboardPatient from "../views/Patient/DashboardPatient";
import DetailResultDataDiagnosis from "../views/Patient/DetailResultDataDiagnosis";
import LoginPatient from "../auth/LoginPatient";
import ProcessAccountPatient from "../auth/ProcessAccountPatient";
import RegisterPatient from "../auth/RegistrationCardPatient";

const RoutesApp = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/patient-profile" element={<ProfilePatient />} />
          <Route path="/patient-result-diagnosis" element={<ResultDataDiagnosis />} />
          <Route path="/patient-detail-result/:id" element={<DetailResultDataDiagnosis />} />
          <Route path="/patient-history" element={<HistoryPatient />} />
          <Route path="/patient-dashboard" element={<DashboardPatient />} />
          <Route path="/" element={<LoginUser />} />
          <Route path="/login-patient" element={<LoginPatient />} />
          <Route path="/status-account-patient" element={<ProcessAccountPatient />} />
          <Route path="/regis-patient" element={<RegisterPatient />} />
          <Route path="/data-user" element={<DataUser />} />
          <Route path="/add-data-user" element={<AddDataUser />} />
          <Route path="/edit-data-user/:id" element={<EditDataUser />} />
          <Route path="/view-data-user/:id" element={<ViewDataUser />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/radiografer-data-pasien" element={<DataPasien />} />
          <Route
            path="/radiografer-add-data-pasien"
            element={<AddDataPasien />}
          />
          <Route
            path="/radiografer-view-data-pasien/:id"
            element={<ViewDataPasien />}
          />
          <Route
            path="/radiografer-edit-data-pasien/:id"
            element={<EditDataPasien />}
          />
          <Route
            path="/radiografer-radiografi-panoramik"
            element={<RadiografiPanoramik />}
          />
          <Route
            path="/radiografer-upload-gambar-panoramik"
            element={<UploadGambarPanoramik />}
          />
          <Route
            path="/radiografer-upload-ulang-gambar-panoramik/:id"
            element={<UploadUlangGambarPanoramik />}
          />
          <Route
            path="/radiografer-view-gambar-panoramik/:id"
            element={<ViewGambarPanoramik />}
          />
          <Route path="/radiografer-history" element={<History />} />
          <Route
            path="/radiografer-view-history/:id"
            element={<ViewHistory />}
          />
          <Route path="/radiografer-profil" element={<Profil />} />
          <Route path="/dokter-data-pasien" element={<DataPasienDokter />} />
          <Route
            path="/dokter-view-data-pasien/:id"
            element={<ViewDataPasienDokter />}
          />
          <Route
            path="/dokter-radiografi-panoramik"
            element={<RadiografiPanoramikDokter />}
          />
          <Route
            path="/dokter-view-gambar-panoramik/:id"
            element={<ViewGambarPanoramikDokter />}
          />
          <Route path="/dokter-profil" element={<ProfilDokter />} />
          <Route path="/odontogram" element={<Odontogram />} />
          <Route path="/dokter-catatan-pasien" element={<CatatanPasien />} />
          <Route
            path="/dokter-detail-catatan-pasien/:id"
            element={<DetailCatatanPasien />}
          />
          <Route
            path="/dokter-view-catatan-pasien/:id"
            element={<ViewCatatanPasien />}
          />
          <Route
            path="/dokter-edit-catatan-pasien"
            element={<EditCatatanPasien />}
          />
          <Route
           path="/satu-sehat-check-patient"
           element={<ViewSatuSehatPatient/>}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default RoutesApp;
