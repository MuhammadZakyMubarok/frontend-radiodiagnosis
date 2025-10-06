import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import InterpretasiManual from "../../../component/Modal/InterpretasiManual";
import VerifiedNo from "../../../component/Modal/VerifiedNo";
import VerifiedYes from "../../../component/Modal/VerifiedYes";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL, apiUrl } from "../../../routes/Config";
import { useParams } from "react-router-dom";
import WithAuthorization from "../../../utils/auth";
import VerifiedResult from "../../../component/Modal/VerifiedResult";
import ButtonVerified from "../../../component/Button/ButtonVerified";
import ButtonVerifiedResult from "../../../component/Button/ButtonVerifiedResult";
import StatusUnverified from "../../../component/Alerts/StatusUnverified";
import StatusOngoing from "../../../component/Alerts/StatusOngoing";
import StatusVerified from "../../../component/Alerts/StatusVerified";
import FinalisasiData from "../../../component/Modal/FinalisasiData";
import "./styleOdontogram.css";
import "../../Responsive/responsive.css";

const ViewGambarPanoramikDokter = () => {
  const auth = WithAuthorization(["doctor"]);

  const [data, setData] = useState({});
  const [doctor, setDoctor] = useState([]);
  const [teethNumber, setTeethNumber] = useState([]);
  const [verified, setverified] = useState(0);
  const [catatanPasien, setCatatanPasien] = useState("");

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  // get data from detection
  const [odontogramImage, setOdontogramImage] = useState({});
  const [componentKey, setComponentKey] = useState(0);
  const [odontogramUp, setOdontogramUp] = useState([]);
  const [odontogramDown, setOdontogramDown] = useState([]);
  const [lubang, setLubang] = useState([]);
  const [isSquare, setIsSquare] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [showImages, setShowImages] = useState(false); // State to manage visibility
  const customOrderUp = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  ];
  const customOrderDown = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
  ];

  const [activePopover, setActivePopover] = useState(null);
  const [activeCheckbox, setActiveCheckbox] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/radiographics/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${baseURL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          setDoctor(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let numbers = [];

    data.diagnoses?.map((diagnose) => {
      numbers.push(diagnose?.tooth_number);
    });
    setTeethNumber(numbers);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveCheckbox(null);
        setActivePopover(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getAll();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(id)
    console.log(data)
    const fileResponse = await axios.get(
      `${baseURL + data.panoramik_picture}`,
      { responseType: "blob" }
    );
    let formData = new FormData();
    formData.append('nama', data.fullname);
    formData.append('rekam_medik', data.medic_number);
    formData.append("file_gambar", fileResponse.data, "odontogram.jpg");
    setOverlay(true);

    try {
      console.log(`Uploading file to: ${apiUrl}/data`);
      await axios.delete(`${apiUrl}/data`, {
          headers: {
              // "ngrok-skip-browser-warning": "true"
          }
      });
      const response = await axios.post(`${apiUrl}/data`, formData, {
        headers: {
            // "ngrok-skip-browser-warning": "true",
            "Accept": "application/json"
        },
      });
      console.log(response.data);
      console.log("Berhasil Deteksi Panoramik");
      getAll();
    } catch (error) {
      console.error(error);
    }
    setOverlay(false);
    setComponentKey(componentKey + 1);
  }

  const deleteData = async () => {
    try {
      await axios.delete(`${apiUrl}/data`, {
          headers: {
              // "ngrok-skip-browser-warning": "true",
          }
      });
    } catch (error) {
      console.error(error);
    }
  };


  const getAll = async () => {
    try {
      const response = await axios.get(`${apiUrl}/data`, {
          headers: {
              // "ngrok-skip-browser-warning": "true",
              "Accept": "application/json"
          }
      });
      const fetchedData = response.data;
      console.log("isi dari fetchdata: ", fetchedData);
      if (fetchedData.predictions?.all?.length > 0 || fetchedData.predictions?.all?.length != "") {
        if (fetchedData.predictions?.show_odontogram?.length > 0) {
          const upperTeeth = fetchedData.predictions.show_odontogram
            .filter((item) => customOrderUp.includes(item.number))
            .sort((a, b) => customOrderUp.indexOf(a.number) - customOrderUp.indexOf(b.number));

          const lowerTeeth = fetchedData.predictions.show_odontogram
            .filter((item) => customOrderDown.includes(item.number))
            .sort((a, b) => customOrderDown.indexOf(a.number) - customOrderDown.indexOf(b.number));

          setOdontogramUp(upperTeeth);
          setOdontogramDown(lowerTeeth);
        }
        setOdontogramImage(fetchedData);
        setLubang(fetchedData.predictions?.missing_teeth);
      } else {
        setOdontogramUp([]);
        setOdontogramDown([]);
        setOdontogramImage({});
      }
    } catch (error) {
      console.error(error);
    }
    setComponentKey(componentKey + 1);
  };

  const handleCheckboxClick = (number) => {
    setActiveCheckbox((prev) => (prev === number ? null : number));
  };
  const togglePopover = (itemId) => {
    setActivePopover((prev) => (prev === itemId ? null : itemId));
  };
  const handleSquareCrop = () => {
    setIsSquare(!isSquare);
    setComponentKey(componentKey + 1);
  };
  const toggleImages = () => {
    setShowImages((prev) => !prev);
  };

  if (auth) {
    console.log("data :", data);
    console.log("odontogramimage: ", odontogramImage);
    console.log("lubang: ", lubang);
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
                  <div className="card mb-4" id="card-l">
                    <div className="card-header pb-2 p-4">
                      <div className="row">
                        <div className="col-8 d-flex align-items-center">
                          <a
                            className="btn btn-outline-secondary btn-sm mb-0 pt-1 pb-1 ps-2 pe-2"
                            href="/dokter-radiografi-panoramik"
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
                    <div className="card-body px-0 pb-2 pt-0 pe-3">
                      <div className="row">
                        <div className="col pe-0">
                          <div className="card-header pb-0 ps-0">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 font-weight-bolder">
                                Verifikasi Gambar Radiografi Panoramik
                              </h6>
                            </div>
                            <div className="row mt-3">
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Kode Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.medic_number}
                                </p>
                              </div>
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Nama Pasien
                                </p>
                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.fullname}
                                </p>
                              </div>

                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Status
                                </p>
                                {data.status === 0 ? (
                                  <p className="text-xs font-weight-bolder mb-0">
                                    <StatusUnverified />
                                  </p>
                                ) : data.status === 1 ? (
                                  <p className="text-xs font-weight-bolder mb-0">
                                    <StatusOngoing />
                                  </p>
                                ) : (
                                  <p className="text-xs font-weight-bolder mb-0">
                                    <StatusVerified />
                                  </p>
                                )}
                              </div>
                              <div className="col-3">
                                <p className="text-xs text-secondary mb-1">
                                  Dokter Verifikator
                                </p>

                                <p className="text-xs font-weight-bolder mb-0">
                                  {data.doctor_name ?? "-"}
                                </p>

                                {/* <select
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  style={{ width: "70%" }}
                                  name="doctor_id"
                                  value={data.doctor_id}
                                  onChange={(e) =>
                                    handleSubmit(e, e.target.value)
                                  }
                                  required
                                >
                                  <option>Pilih Dokter</option>
                                  {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                      {doctor.fullname}
                                    </option>
                                  ))}
                                </select> */}
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
                                  <div className="row d-flex justify-content-center mt-4">
                                    <div className="col-8">
                                      <p className="text-xs p-2 mb-0">
                                        Gambar Radiografi
                                      </p>

                                      <img
                                        className="img-fluid border-radius-xl p-2"
                                        src={`${baseURL + data.panoramik_picture}`}
                                      />
                                      <div className="d-flex">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm ms-auto"
                                          onClick={handleSubmit}
                                        >
                                          Deteksi Odontogram
                                        </button>
                                      </div>

                                      {overlay && (
                                        <div className="modal-content">
                                          <div className="modal-body text-center">
                                            <div className="spinner-border text-primary">
                                              {/*<span className="sr-only">Loading...</span>*/}
                                            </div>
                                            <h4 className="mt-3">Loading...</h4>
                                          </div>
                                        </div>
                                      )}

                                      {odontogramImage.gambar && (
                                        <div className="card shadow-none mt-2 me-2 ms-2 mb-4">
                                          <div className="card-body">
                                            <p className="text-xs p-2 mb-0">
                                              Gambar Radiografi Panoramik
                                            </p>
                                            <div className="text-center mt-4">
                                              <img
                                                src={odontogramImage.gambar}
                                                alt="Gambar Odontogram"
                                                key={componentKey}
                                                // className="w-64 h-40 object-cover mx-auto"
                                                className="img-fluid border-radius-xl p-2"
                                              // style={{ maxWidth: "75%", maxHeight: "75%", objectFit: "contain" }} // Ensures the image fits within its container
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {odontogramImage.gambar && (
                                        <div className="card shadow-none mt-2 me-2 ms-2 mb-4">
                                          <div className="card-body">
                                            <p className="text-xs p-2 mb-0">
                                              Odontogram
                                            </p>
                                            <div className="row d-flex">
                                              {/* Gigi Atas - Upper Teeth */}
                                              <div className="text-center mt-2">
                                                <div className="row">
                                                  <div className="d-flex justify-content-center img-fluid mb-2">
                                                    <img src="../assets/img/App/line2.png" />
                                                  </div>
                                                  <div className="col d-flex justify-content-center">
                                                    {odontogramUp.length > 0 ? (
                                                      odontogramUp.map((item, index) =>
                                                        item.accuracy != null ? (
                                                          <div key={item.number} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                            <input
                                                              type="checkbox"
                                                              className="btn-check"
                                                              id={`btncheck${item.number}`}
                                                              autoComplete="off"
                                                              checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                              onChange={() => handleCheckboxClick(item.number)}
                                                            />
                                                            <label
                                                              className="btn btn-outline-secondary text-xs p-2"
                                                              htmlFor={`btncheck${item.number}`}
                                                              onClick={() => togglePopover(item.number)}
                                                            >
                                                              {item.number}
                                                            </label>
                                                            {activePopover === item.number && activeCheckbox === item.number && (
                                                              <div className="popover-content">
                                                                <p>Nomor Gigi: {item.number}</p>
                                                                {!item.isDuplicate ? (
                                                                  // Render images for non-duplicate teeth
                                                                  Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                    <div className="carousel slide">
                                                                      <div className="carousel-inner">
                                                                        {item.urlImage.map((img, i) => (
                                                                          <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                                                            <img
                                                                              className="bg-white"
                                                                              width="50"
                                                                              style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                              src={isSquare ? item.urlImageSquare[i] : img}
                                                                              alt={`carousel ${i}`}
                                                                            />
                                                                          </div>
                                                                        ))}
                                                                      </div>
                                                                    </div>
                                                                  ) : (
                                                                    <img
                                                                      className="bg-white mx-1 responsive-img"
                                                                      width="50"
                                                                      style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                      src={isSquare ? item.urlImageSquare : item.urlImage}
                                                                      alt="Odontogram"
                                                                    />
                                                                  )
                                                                ) : (
                                                                  // Render image for duplicates using index 1
                                                                  <img
                                                                    className="bg-white mx-1 responsive-img"
                                                                    width="50"
                                                                    style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                    src={isSquare ? item.urlImageSquare[1] : item.urlImage[1]}
                                                                    alt="Duplicate Image"
                                                                  />
                                                                )}
                                                              </div>
                                                            )}
                                                          </div>
                                                        ) : (
                                                          <div key={index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                            <input
                                                              type="checkbox"
                                                              className="btn-check"
                                                              id={`btncheck${item.number}`}
                                                              autoComplete="off"
                                                              checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                              onChange={() => handleCheckboxClick(item.number)}
                                                            />
                                                            <label
                                                              className="btn btn-outline-danger text-xs p-2 flex items-center justify-center"
                                                              htmlFor={`btncheck${item.number}`}
                                                              onClick={() => togglePopover(item.number)}
                                                            >
                                                              {item.number}
                                                            </label>
                                                            {activePopover === item.number && activeCheckbox === item.number && (
                                                              <div className="popover-content">
                                                                <p>Nomor Gigi: {item.number}</p>
                                                                <div className="mx-1">
                                                                  Gigi Hilang
                                                                </div>

                                                              </div>
                                                            )}
                                                          </div>
                                                        )
                                                      )
                                                    ) : (
                                                      customOrderUp.map((item, index) => (
                                                        <div key={index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                          <input
                                                            type="checkbox"
                                                            className="btn-check"
                                                            id={`btncheck${item}`}
                                                            autoComplete="off"
                                                            checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                            onChange={() => handleCheckboxClick(item.number)}
                                                          />
                                                          <label
                                                            className="btn btn-outline-danger text-xs p-2 flex items-center justify-center"
                                                          >
                                                            {item}
                                                          </label>
                                                        </div>
                                                      ))
                                                    )}
                                                  </div>
                                                  <div className="col d-flex justify-content-center">
                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck55"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        55
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck55"
                                                    >
                                                      55
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck54"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        54
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck54"
                                                    >
                                                      54
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck53"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        53
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck53"
                                                    >
                                                      53
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck52"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        52
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck52"
                                                    >
                                                      52
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck51"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        51
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck51"
                                                    >
                                                      51
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck61"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        61
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck61"
                                                    >
                                                      61
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck62"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        62
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck62"
                                                    >
                                                      62
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck63"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        63
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck63"
                                                    >
                                                      63
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck64"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        64
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck64"
                                                    >
                                                      64
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck65"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        65
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck65"
                                                    >
                                                      65
                                                    </label>
                                                  </div>
                                                  <div className="d-flex justify-content-center img-fluid mb-5">
                                                    <img src="../assets/img/App/line.png" />
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Gigi Bawah - Lower Teeth */}
                                              <div className="text-center">
                                                <div className="row">
                                                  <div className="d-flex justify-content-center img-fluid mb-2">
                                                    <img src="../assets/img/App/line.png" />
                                                  </div>
                                                  <div className="col d-flex justify-content-center mt-2">
                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck85"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        85
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck85"
                                                    >
                                                      85
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck84"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        84
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck84"
                                                    >
                                                      84
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck83"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        83
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck83"
                                                    >
                                                      83
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck82"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        82
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck82"
                                                    >
                                                      82
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck81"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        81
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck81"
                                                    >
                                                      81
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck71"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        71
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck71"
                                                    >
                                                      71
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck72"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        72
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck72"
                                                    >
                                                      72
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck73"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        73
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck73"
                                                    >
                                                      73
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck74"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        74
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck74"
                                                    >
                                                      74
                                                    </label>

                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id="btncheck75"
                                                      autoComplete="off"
                                                      checked={teethNumber.includes(
                                                        75
                                                      )}
                                                    />
                                                    <label
                                                      className="btn btn-outline-secondary text-xs p-2"
                                                      for="btncheck75"
                                                    >
                                                      75
                                                    </label>
                                                  </div>
                                                  <div className="col d-flex justify-content-center">
                                                    {odontogramDown.length > 0 ? (
                                                      odontogramDown.map((item, index) =>
                                                        item.accuracy != null ? (
                                                          <div key={item.number} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                            <input
                                                              type="checkbox"
                                                              className="btn-check"
                                                              id={`btncheck${item.number}`}
                                                              autoComplete="off"
                                                              checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                              onChange={() => handleCheckboxClick(item.number)}
                                                            />
                                                            <label className="btn btn-outline-secondary text-xs p-2"
                                                              htmlFor={`btncheck${item.number}`}
                                                              onClick={() => togglePopover(item.number)}
                                                            >
                                                              {item.number}
                                                            </label>
                                                            {activePopover === item.number && activeCheckbox === item.number && (
                                                              <div className="popover-content">
                                                                <p>Nomor Gigi: {item.number}</p>
                                                                {!item.isDuplicate ? (
                                                                  // Render images for non-duplicate teeth
                                                                  Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                    <div className="carousel slide">
                                                                      <div className="carousel-inner">
                                                                        {item.urlImage.map((img, i) => (
                                                                          <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                                                            <img
                                                                              className="bg-white"
                                                                              width="50"
                                                                              style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                              src={isSquare ? item.urlImageSquare[i] : img}
                                                                              alt={`carousel ${i}`}
                                                                            />
                                                                          </div>
                                                                        ))}
                                                                      </div>
                                                                    </div>
                                                                  ) : (
                                                                    <img
                                                                      className="bg-white mx-1 responsive-img"
                                                                      width="50"
                                                                      style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                      src={isSquare ? item.urlImageSquare : item.urlImage}
                                                                      alt="Odontogram"
                                                                    />
                                                                  )
                                                                ) : (
                                                                  // Render image for duplicates using index 1
                                                                  <img
                                                                    className="bg-white mx-1 responsive-img"
                                                                    width="50"
                                                                    style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                    src={isSquare ? item.urlImageSquare[1] : item.urlImage[1]}
                                                                    alt="Duplicate Image"
                                                                  />
                                                                )}
                                                              </div>
                                                            )}
                                                          </div>
                                                        ) : (
                                                          <div key={index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                            <input
                                                              type="checkbox"
                                                              className="btn-check"
                                                              id={`btncheck${item.number}`}
                                                              autoComplete="off"
                                                              checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                              onChange={() => handleCheckboxClick(item.number)}
                                                            />
                                                            <label className="btn btn-outline-danger text-xs p-2 flex items-center justify-center"
                                                              htmlFor={`btncheck${item.number}`}
                                                              onClick={() => togglePopover(item.number)}
                                                            >
                                                              {item.number}
                                                            </label>
                                                            {activePopover === item.number && activeCheckbox === item.number && (
                                                              <div className="popover-content">
                                                                <p>Nomor Gigi: {item.number}</p>
                                                                <div className="mx-1" >
                                                                  Gigi Hilang
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        )
                                                      )
                                                    ) : (
                                                      customOrderDown.map((item, index) => (
                                                        <div key={index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef} >
                                                          <input
                                                            type="checkbox"
                                                            className="btn-check"
                                                            id={`btncheck${item}`}
                                                            autoComplete="off"
                                                            checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                            onChange={() => handleCheckboxClick(item.number)}
                                                          />
                                                          <label
                                                            className="btn btn-outline-danger text-xs p-2 flex items-center justify-center"
                                                          >
                                                            {item}
                                                          </label>
                                                        </div>
                                                      ))
                                                    )}
                                                  </div>
                                                  <div className="d-flex justify-content-center img-fluid">
                                                    <img src="../assets/img/App/line2.png" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {odontogramImage.gambar && (
                                        <div className="card shadow-none mt-2 me-2 ms-2 mb-4">
                                          <div className="card-body">
                                            <div className="text-center mt-3">
                                              <div>
                                                <div className="text-center mt-3 d-flex align-items-center justify-content-center">
                                                  <div style={{ maxWidth: '1500px' }}>
                                                    <div className="card">
                                                      <div
                                                        className={`card-header ${showImages ? 'center' : ''}`}
                                                        onClick={toggleImages}
                                                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                      >
                                                        <p className="text-xs p-2 mb-0">
                                                          Gambar Crop Gigi
                                                        </p>
                                                        <i className={`mt-3 mb-0 fas fa-chevron-${showImages ? 'up' : 'down'}`} /> {/* Arrow icon */}
                                                      </div>
                                                      <div className={`card-body py-2 dropdown-body ${showImages ? 'show' : ''}`}>
                                                        {/* Odontogram Up */}
                                                        <div className="container-fluid d-flex mb-6 justify-content-center flex-wrap">
                                                          <div className="row no-gutters d-flex justify-content-center">
                                                            {odontogramUp.map((item) => (
                                                              <div key={item.number} className="col-auto flex-item text-center">
                                                                <div className="flex-column-container">
                                                                  {!item.isDuplicate && !item.isMissing ? (
                                                                    Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                      <div className="card mx-1" style={{ elevation: 1, maxWidth: '444px' }}>
                                                                        <div className="carousel slide">
                                                                          <div className="carousel-inner">
                                                                            {item.urlImage.map((img, i) => (
                                                                              <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                                                                <img
                                                                                  className="bg-white"
                                                                                  width="50"
                                                                                  style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                                  src={isSquare ? item.urlImageSquare[i] : img}
                                                                                  alt={`carousel ${i}`}
                                                                                />
                                                                              </div>
                                                                            ))}
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    ) : (
                                                                      <img
                                                                        className="bg-white mx-1 responsive-img"
                                                                        width="50"
                                                                        style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                        src={isSquare ? item.urlImageSquare : item.urlImage}
                                                                        alt="Odontogram"
                                                                      />
                                                                    )
                                                                  ) : item.isMissing ? (
                                                                    <div className="mx-1 missing-text" style={{ width: '50px' }}>
                                                                      Hilang
                                                                    </div>
                                                                  ) : (
                                                                    Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                      <img
                                                                        className="bg-white mx-1 responsive-img"
                                                                        width="50"
                                                                        style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                        src={isSquare ? item.urlImageSquare[1] : item.urlImage[1]}
                                                                        alt="Duplicate Image"
                                                                      />
                                                                    ) : (
                                                                      <img
                                                                        className="bg-white mx-1 responsive-img"
                                                                        width="50"
                                                                        style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                        src={isSquare ? item.urlImageSquare[0] : item.urlImage[0]}
                                                                        alt="Duplicate Image"
                                                                      />
                                                                    )
                                                                  )}
                                                                  <div className="mt-2">{item.number}</div>
                                                                </div>
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </div>

                                                        {/* Odontogram Down */}
                                                        <div className="container-fluid d-flex justify-content-center">
                                                          <div className="row no-gutters d-flex justify-content-center">
                                                            {odontogramDown.map((item) => (
                                                              <div key={item.number} className="col-auto flex-item text-center">
                                                                <div className="mb-2">{item.number}</div>
                                                                {!item.isDuplicate && !item.isMissing ? (
                                                                  Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                    <div className="card mx-1" style={{ elevation: 1, maxWidth: '444px' }}>
                                                                      <div className="carousel slide">
                                                                        <div className="carousel-inner">
                                                                          {item.urlImage.map((img, i) => (
                                                                            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                                                              <img
                                                                                className="bg-white"
                                                                                width="50"
                                                                                style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                                src={isSquare ? item.urlImageSquare[i] : img}
                                                                                alt={`carousel ${i}`}
                                                                              />
                                                                            </div>
                                                                          ))}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  ) : (
                                                                    <img
                                                                      className="bg-white mx-1 responsive-img"
                                                                      width="50"
                                                                      style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                      src={isSquare ? item.urlImageSquare : item.urlImage}
                                                                      alt="Odontogram"
                                                                    />
                                                                  )
                                                                ) : item.isMissing ? (
                                                                  <div className="mx-1 missing-text" style={{ width: '50px' }}>
                                                                    Hilang
                                                                  </div>
                                                                ) : (
                                                                  Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                    <img
                                                                      className="bg-white mx-1 responsive-img"
                                                                      width="50"
                                                                      style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                      src={isSquare ? item.urlImageSquare[1] : item.urlImage[1]}
                                                                      alt="Duplicate Image"
                                                                    />
                                                                  ) : (
                                                                    <img
                                                                      className="bg-white mx-1 responsive-img"
                                                                      width="50"
                                                                      style={{ maxHeight: '100px', aspectRatio: isSquare ? '1' : 'auto' }}
                                                                      src={isSquare ? item.urlImageSquare[0] : item.urlImage[0]}
                                                                      alt="Duplicate Image"
                                                                    />
                                                                  )
                                                                )}
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </div>

                                                        {/* Change crop button */}
                                                        <div className="d-flex justify-content-end">
                                                          <button className="btn btn-sm mt-5 btn-outline-secondary" onClick={handleSquareCrop}>
                                                            Change to {isSquare ? 'Original Crop' : 'Square crop'}
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* start Diagram Gigi */}
                                      {!odontogramImage.gambar && (
                                        <div className="card shadow-none me-2 ms-2 mb-4">
                                          <div className="card-body">
                                            <p className="text-xs p-2 mb-0 ">
                                              Odontogram
                                            </p>
                                            <div className="row">
                                              <div className="d-flex justify-content-center img-fluid mt-2">
                                                <img src="../assets/img/App/line2.png" />
                                              </div>
                                              <div className="col d-flex justify-content-center mt-3">
                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck18"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    18
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck18"
                                                >
                                                  18
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck17"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    17
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck17"
                                                >
                                                  17
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck16"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    16
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck16"
                                                >
                                                  16
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck15"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    15
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck15"
                                                >
                                                  15
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck14"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    14
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck14"
                                                >
                                                  14
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck13"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    13
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck13"
                                                >
                                                  13
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck12"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    12
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck12"
                                                >
                                                  12
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck11"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    11
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck11"
                                                >
                                                  11
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck21"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    21
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck21"
                                                >
                                                  21
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck22"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    22
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck22"
                                                >
                                                  22
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck23"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    23
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck23"
                                                >
                                                  23
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck24"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    24
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck24"
                                                >
                                                  24
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck25"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    25
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck25"
                                                >
                                                  25
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck26"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    26
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck26"
                                                >
                                                  26
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck27"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    27
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck27"
                                                >
                                                  27
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck28"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    28
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2 mb-0"
                                                  for="btncheck28"
                                                >
                                                  28
                                                </label>
                                              </div>

                                              <div className="col d-flex justify-content-center mt-3">
                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck55"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    55
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck55"
                                                >
                                                  55
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck54"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    54
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck54"
                                                >
                                                  54
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck53"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    53
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck53"
                                                >
                                                  53
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck52"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    52
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck52"
                                                >
                                                  52
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck51"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    51
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck51"
                                                >
                                                  51
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck61"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    61
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck61"
                                                >
                                                  61
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck62"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    62
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck62"
                                                >
                                                  62
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck63"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    63
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck63"
                                                >
                                                  63
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck64"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    64
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck64"
                                                >
                                                  64
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck65"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    65
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck65"
                                                >
                                                  65
                                                </label>
                                              </div>

                                              <div className="d-flex justify-content-center img-fluid">
                                                <img src="../assets/img/App/line.png" />
                                              </div>

                                              <div className="d-flex justify-content-center img-fluid mt-5">
                                                <img src="../assets/img/App/line.png" />
                                              </div>

                                              <div className="col d-flex justify-content-center mt-2">
                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck85"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    85
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck85"
                                                >
                                                  85
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck84"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    84
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck84"
                                                >
                                                  84
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck83"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    83
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck83"
                                                >
                                                  83
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck82"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    82
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck82"
                                                >
                                                  82
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck81"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    81
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck81"
                                                >
                                                  81
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck71"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    71
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck71"
                                                >
                                                  71
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck72"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    72
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck72"
                                                >
                                                  72
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck73"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    73
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck73"
                                                >
                                                  73
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck74"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    74
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck74"
                                                >
                                                  74
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck75"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    75
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck75"
                                                >
                                                  75
                                                </label>
                                              </div>

                                              <div className="col d-flex justify-content-center">
                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck48"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    48
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck48"
                                                >
                                                  48
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck47"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    47
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck47"
                                                >
                                                  47
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck46"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    46
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck46"
                                                >
                                                  46
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck45"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    45
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck45"
                                                >
                                                  45
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck44"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    44
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck44"
                                                >
                                                  44
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck43"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    43
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck43"
                                                >
                                                  43
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck42"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    42
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck42"
                                                >
                                                  42
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck41"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    41
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck41"
                                                >
                                                  41
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck31"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    31
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck31"
                                                >
                                                  31
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck32"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    32
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck32"
                                                >
                                                  32
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck33"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    33
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck33"
                                                >
                                                  33
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck34"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    34
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck34"
                                                >
                                                  34
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck35"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    35
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck35"
                                                >
                                                  35
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck36"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    36
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck36"
                                                >
                                                  36
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck37"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    37
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck37"
                                                >
                                                  37
                                                </label>

                                                <input
                                                  type="checkbox"
                                                  className="btn-check"
                                                  id="btncheck38"
                                                  autoComplete="off"
                                                  checked={teethNumber.includes(
                                                    38
                                                  )}
                                                />
                                                <label
                                                  className="btn btn-outline-secondary text-xs p-2"
                                                  for="btncheck38"
                                                >
                                                  38
                                                </label>
                                              </div>
                                              <div className="d-flex justify-content-center img-fluid">
                                                <img src="../assets/img/App/line2.png" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {/* end Diagram Gigi */}

                                      <div className="card shadow-none mt-4 me-2 ms-2 border-0">
                                        {Array.isArray(lubang) && lubang.length > 0 ? (
                                          <div className="card-body">
                                            <p className="text-xs">
                                              Diagnosa AI Gigi Hilang
                                            </p>
                                            {lubang.map((item, index) => (
                                              <div className="row" key={index}>
                                                <div className="col-2 pt-2">
                                                  <ul className="ps-3">
                                                    <li className="text-xs">
                                                      Gigi #{item}
                                                    </li>
                                                  </ul>
                                                </div>
                                                <div className="col-4 ps-0 pt-2">
                                                  <p className="text-xs text-dark font-weight-bold">
                                                    Gigi Hilang
                                                  </p>
                                                </div>
                                                <hr
                                                  style={{
                                                    height: "1px",
                                                    borderWidth: "0px",
                                                    color: "gray",
                                                    backgroundColor: "gray",
                                                    marginBottom: "0px",
                                                    marginTop: "0px",
                                                  }}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div></div>
                                        )}

                                        <div className="card-body">
                                          <p className="text-xs">
                                            Diagnosa Gigi Hilang
                                          </p>
                                          {data.diagnoses?.map((diagnose) => {
                                            if (diagnose?.system_diagnosis) {
                                              return (
                                                <div className="row">
                                                  <div className="col-2">
                                                    <ul className="ps-3">
                                                      <li className="text-xs">
                                                        Gigi #
                                                        {diagnose?.tooth_number}
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="col-4 ps-0">
                                                    <p className="text-xs text-dark font-weight-bold">
                                                      {
                                                        diagnose?.system_diagnosis
                                                      }
                                                    </p>
                                                  </div>

                                                  <div className="col-6 text-end">
                                                    {diagnose?.is_corerct ===
                                                      null ? (
                                                      <ButtonVerified
                                                        index={diagnose?.id}
                                                      />
                                                    ) : (
                                                      <ButtonVerifiedResult
                                                        index={diagnose?.id}
                                                      />
                                                    )}
                                                  </div>
                                                  <VerifiedYes
                                                    index={diagnose?.id}
                                                    diagnose={diagnose}
                                                    diagnoses={data.diagnoses}
                                                    historyId={data.history_id}
                                                  />
                                                  <VerifiedResult
                                                    index={diagnose?.id}
                                                    diagnose={diagnose}
                                                  />
                                                </div>
                                              );
                                            }
                                          })}

                                          <div className="row">
                                            <div className="col-12">
                                              {/* <p className="text-xxs text-secondary font-weight-bold">
                                                Radiodiagnosis Verifikator
                                              </p> */}
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
                                          <div className="d-grid">
                                            <button
                                              className="btn btn-sm btn-primary mt-2 mb-4"
                                              type="button"
                                              data-bs-toggle="modal"
                                              data-bs-target="#exampleModal3"
                                              disabled={
                                                data.status === 2 ? true : false
                                              }
                                            >
                                              Tambah Diagnosa
                                            </button>
                                            <InterpretasiManual
                                              radiographicId={data.history_id}
                                            />
                                          </div>
                                          <p className="text-xs">
                                            Catatan Untuk Pasien
                                          </p>
                                          <form>
                                            <div className="row">
                                              <div className="col-12">
                                                <textarea
                                                  className="form-control text-xs"
                                                  id="catatanpasien"
                                                  name="catatanpasien"
                                                  placeholder={
                                                    data.status === 2 && data.catatan_pasien == null ? "Catatan Pasien" : ""
                                                  }
                                                  rows="5"
                                                  value={data.catatan_pasien == null ? catatanPasien : data.catatan_pasien}
                                                  onChange={(e) => setCatatanPasien(e.target.value)}
                                                  disabled={
                                                    data.status === 2 ? true : false
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </form>
                                          <hr
                                            style={{
                                              height: "1px",
                                              borderWidth: "0px",
                                              color: "gray",
                                              backgroundColor: "gray",
                                              marginBottom: "0px",
                                              marginTop: "20px",
                                              marginStart: "0px",
                                            }}
                                          />
                                          <div className="d-grid">
                                            <button
                                              className="btn btn-sm btn-success mt-4 mb-2"
                                              type="button"
                                              data-bs-toggle="modal"
                                              data-bs-target="#finalisasiModal"
                                              disabled={
                                                data.status === 2 ? true : false
                                              }
                                            >
                                              Finalisasi Data
                                            </button>
                                            <FinalisasiData
                                              radiographicId={data.history_id}
                                              catatanPasien={catatanPasien}
                                            />
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
            </div>
          </main>
        </body>
      </div >
    );
  } else {
    return <div></div>;
  }
};

export default ViewGambarPanoramikDokter;
