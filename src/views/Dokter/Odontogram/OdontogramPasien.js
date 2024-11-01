import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import { baseURL, apiUrl } from "../../../routes/Config";
import WithAuthorization from "../../../utils/auth";
// import "./styleOdontogram.css";

const OdontogramPasien = () => {
  const auth = WithAuthorization(["doctor"]);

  // get patient data
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const token = sessionStorage.getItem("token");

  // get data from detection
  const [componentKey, setComponentKey] = useState(0);
  const [data, setData] = useState({});
  const [odontogramUp, setOdontogramUp] = useState([]);
  const [odontogramDown, setOdontogramDown] = useState([]);
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


  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/radiographics/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: source.token,
        });

        if (response.data.data) {
          setPatients(response.data.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
    return () => {
      source.cancel("Component unmounted or refreshed, request canceled.");
    };
  }, [token]);

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


  // Handle patient selection change
  const handlePatientChange = (e) => {
    const selectedId = e.target.value;
    setSelectedPatientId(selectedId);

    // Find and set the selected patient from the patients array
    const patient = patients.find((p) => p.medic_number === selectedId);
    setSelectedPatient(patient);
  };


  //handle submit button
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('nama', selectedPatient.fullname);
    formData.append('rekam_medik', selectedPatient.medic_number);
    if (selectedPatient.panoramik_picture) {
      const fileResponse = await axios.get(
        `${baseURL + selectedPatient.panoramik_picture}`,
        { responseType: "blob" }
      );
      formData.append("file_gambar", fileResponse.data, "odontogram.jpg");
    }
    setOverlay(true);

    try {
      console.log(`Uploading file to: ${apiUrl}/data`);
      await axios.delete(`${apiUrl}/data`);
      const response = await axios.post(`${apiUrl}/data`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      console.log("Berhasil Deteksi Panoramik");
      getAll();
    } catch (error) {
      console.error(error);
    }
    setOverlay(false);
    // window.location.reload();
    setComponentKey(componentKey + 1);
  }

  // const deleteData = async () => {
  //   try {
  //     await axios.delete(`${apiUrl}/data`);
  //     getAll();
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   // window.location.reload();
  // };

  const getAll = async () => {
    try {
      const response = await axios.get(`${apiUrl}/data`);
      const fetchedData = response.data;

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
      setData(fetchedData);
    } catch (error) {
      console.error(error);
    }
    setComponentKey(componentKey + 1);
  };

  if (auth) {
    // console.log('Data deteksi:', data);
    console.log('odontogram up deteksi:', odontogramUp);

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
                    <div className="card-body px-0 pb-2 pt-0 pe-3">
                      <div className="row">
                        <div className="col pe-0">
                          <div className="card-header pb-0 ps-0">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-4 font-weight-bolder">
                                Odontogram Pasien
                              </h6>
                            </div>
                            <div className="row mt-3s">
                              <div className="col-4">
                                <p className="text-xs text-secondary mb-1">
                                  Kode Pasien
                                </p>
                                <select
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  style={{ width: "70%" }}
                                  name="medic_number"
                                  value={selectedPatientId}
                                  onChange={handlePatientChange}
                                  required
                                >
                                  <option value="">Pilih Kode Pasien</option>
                                  {patients.map((patient) => (
                                    <option
                                      key={patient.medic_number}
                                      value={patient.medic_number}
                                    >
                                      {patient.medic_number}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-4">
                                <p className="text-xs text-secondary mb-2">
                                  Nama Pasien
                                </p>
                                <p className="text-xs font-weight-bolder">
                                  {selectedPatient ? selectedPatient.fullname : "Nama tidak tersedia"}
                                </p>
                              </div>

                              <div className=" col-4 d-flex flex-column align-items-start mt-2">
                                <p className="text-xs text-secondary mb-2">
                                  Gambar Odontogram Pasien
                                </p>

                                {selectedPatient ? (
                                  <img
                                    src={`${baseURL + selectedPatient.panoramik_picture}`}
                                    alt={`Foto dari ${selectedPatient.fullname}`}
                                    style={{ width: "300px", height: "150px" }}
                                  />
                                ) : (
                                  <p className="text-xs font-weight-bolder">Gambar tidak tersedia</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm ms-auto"
                                onClick={handleSubmit}
                              >
                                Deteksi Odontogram
                              </button>
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
                          {overlay && (
                            <div className="modal-content">
                              <div className="modal-body text-center">
                                <div className="spinner-border text-primary">
                                  <span className="sr-only">Loading...</span>
                                </div>
                                <h4 className="mt-3">Loading...</h4>
                              </div>
                            </div>
                          )}
                          {Object.keys(data).length > 0 && (
                            <div className="card-body pb-2 pt-0">
                              <div className="row justify-content-center">
                                <div className="col-md-12">
                                  <div
                                    className="card shadow-none mt-2 p-2"
                                    style={{ backgroundColor: "ghostwhite" }}
                                  >
                                    <div >
                                      <div className="grid grid-cols-2 gap-4 px-4 py-2">
                                        <div>
                                          <h4 className="text-xs text-secondary mb-2">Nama: {data.nama}</h4>
                                        </div>
                                        <div>
                                          <h4 className="text-xs text-secondary mb-2">No Rekam Medik: {data.rekam_medik}</h4>
                                        </div>
                                      </div>
                                      <div className="text-center mt-4">
                                        <img
                                          src={data.gambar}
                                          alt="Gambar Odontogram"
                                          key={componentKey}
                                          className="w-64 h-40 object-cover mx-auto"
                                          style={{ maxWidth: "75%", maxHeight: "75%", objectFit: "contain" }} // Ensures the image fits within its container
                                        />
                                      </div>

                                      <div className="row d-flex">
                                        <h5 className="mt-3 px-5">Citra Odontogram</h5>
                                        {/* Gigi Atas - Upper Teeth */}
                                        <div className="text-center mt-2">
                                          <div className="col d-flex justify-content-center">

                                            {odontogramUp.length > 0 ? (
                                              odontogramUp.map((item, index) =>
                                                item.accuracy != null ? (
                                                  <div key={item.number} className="popover-container inline-block m-1" ref={containerRef}>
                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id={`btncheck${item.number}`}
                                                      autoComplete="off"
                                                      checked={activeCheckbox === item.number}
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
                                                  <div key={index} className="popover-container inline-block m-1" ref={containerRef}>
                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id={`btncheck${item.number}`}
                                                      autoComplete="off"
                                                      checked={activeCheckbox === item.number}
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
                                                <div key={index} className="popover-container inline-block m-1" ref={containerRef}>
                                                  <input
                                                    type="checkbox"
                                                    className="btn-check"
                                                    id={`btncheck${item}`}
                                                    autoComplete="off"
                                                    checked={activeCheckbox === item.number}
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
                                        </div>

                                        {/* Gigi Bawah - Lower Teeth */}
                                        <div className="text-center">
                                          <div className="col d-flex justify-content-center">
                                            {odontogramDown.length > 0 ? (
                                              odontogramDown.map((item, index) =>
                                                item.accuracy != null ? (
                                                  <div key={item.number} className="popover-container inline-block m-1" ref={containerRef}>
                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id={`btncheck${item.number}`}
                                                      autoComplete="off"
                                                      checked={activeCheckbox === item.number}
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
                                                  <div key={index} className="popover-container inline-block m-1" ref={containerRef}>
                                                    <input
                                                      type="checkbox"
                                                      className="btn-check"
                                                      id={`btncheck${item.number}`}
                                                      autoComplete="off"
                                                      checked={activeCheckbox === item.number}
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
                                                <div key={index} className="popover-container inline-block m-1" ref={containerRef} >
                                                  <input
                                                    type="checkbox"
                                                    className="btn-check"
                                                    id={`btncheck${item}`}
                                                    autoComplete="off"
                                                    checked={activeCheckbox === item.number}
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
                                        </div>
                                      </div>

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
                                                  <h5 className="mt-3 mb-0">Crop Gigi</h5>
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
                                </div>
                              </div>
                            </div>

                          )}

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

export default OdontogramPasien;
