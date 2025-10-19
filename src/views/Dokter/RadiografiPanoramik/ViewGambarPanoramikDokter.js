import axios from "axios";
import {React, useEffect, useRef, useState} from "react";
import HeaderDataUser from "../../../component/Header/HeaderDataUser";
import InterpretasiManual from "../../../component/Modal/InterpretasiManual";
import ConfirmDiagnosaModal from "../../../component/Modal/ConfirmDiagnosaModal";
import VerifiedDiagnosaModal from "../../../component/Modal/VerifiedDiagnosaModal";
import VerifiedYes from "../../../component/Modal/VerifiedYes";
import SidebarDokter from "../../../component/Sidebar/SidebarDokter";
import {apiUrl, baseURL} from "../../../routes/Config";
import {useParams} from "react-router-dom";
import WithAuthorization from "../../../utils/auth";
import VerifiedResult from "../../../component/Modal/VerifiedResult";
import ButtonVerified from "../../../component/Button/ButtonVerified";
import ButtonVerifiedResult from "../../../component/Button/ButtonVerifiedResult";
import StatusUnverified from "../../../component/Alerts/StatusUnverified";
import StatusOngoing from "../../../component/Alerts/StatusOngoing";
import StatusVerified from "../../../component/Alerts/StatusVerified";
import FinalisasiData from "../../../component/Modal/FinalisasiData";
// Material UI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {Alert, Button} from "@mui/material";
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
// Css
import "./styleOdontogram.css";
import "../../Responsive/responsive.css";
// Icon
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DescriptionIcon from '@mui/icons-material/Description';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
// Helper
import {insertInOrder, toNum} from "../../../utils/helper";


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
  const [problematicTeeth, setProblematicTeeth] = useState([]);
  // data for problematicTeeth {toothId: int, isManual:bool, isVerified: bool, prediction: string, verificator_note: string (ini dibuat yang non-manual/AI)}
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
  const [openConfirmDiagnosaModal, setOpenConfirmDiagnosaModal] = useState(false)
  const [isOpenVerifiedDiagnosaModal, setIsOpenVerifiedDiagnosaModal]= useState(false)
  const [isOpenModalManualDiagnose, setIsModalManualDiagnose] = useState(false)
  const [isOpenFinalisasiDataModal, setIsOpenFinalisasiDataModal] = useState(false)
  const [selectedDiagnosa, setSelectedDiagnosa] = useState({ })
  const [submitAlert, setSubmitAlert] = useState({
      open: false,
      message: "",
      severity: "info" // "success" | "error" | "warning" | "info"
  });

    const containerRef = useRef(null);

    useEffect(() => {
        loadAllData();
    }, [id, token]);


    useEffect(() => {
    let numbers = [];

    data.diagnoses?.map((diagnose) => {
      numbers.push(diagnose?.tooth_number);
    });
    setTeethNumber(numbers);
  }, [data]);

    useEffect(() => {
        console.log('problematicTeeth now:', problematicTeeth);
    }, [problematicTeeth]);

    useEffect(() => {
        console.log('data now:', data);
    }, [data]);

    useEffect(() => {
        console.log('Odontogram UP now:', odontogramUp);
    }, [odontogramUp]);

    const mapServerDiagToProblematic = (diag) => {
        const toothNumber = Number(diag?.tooth_number ?? diag?.toothId);
        return {
            toothId: Number.isFinite(toothNumber) ? toothNumber : null,
            isManual: !!diag?.manual_diagnosis,
            isVerified: !!(diag?.is_corerct === 1 || diag?.is_verified === 1),
            prediction: diag?.manual_diagnosis ?? diag?.system_diagnosis ?? "Gigi Hilang",
            verificator_note: diag?.verificator_note ?? null
        };
    };

    const loadAllData = async () => {
        try {
            const [detailResp,  detectionResp] = await Promise.all([
                axios.get(`${baseURL}/radiographics/detail/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${apiUrl}/data`, { headers: { Accept: "application/json" } })
            ]);

            const payload = detailResp?.data?.data ?? {};
            setData(payload);
            setCatatanPasien(payload.catatan_pasien)

            const serverDiagnoses = Array.isArray(payload.diagnoses) ? payload.diagnoses.map(mapServerDiagToProblematic).filter(d => d.toothId != null) : [];

            const fetchedData = detectionResp?.data ?? {};
            const preds = fetchedData?.predictions ?? {};
            const rawMissing = Array.isArray(preds.missing_teeth) ? preds.missing_teeth : [];
            const uniqueMissing = Array.from(new Set(rawMissing.map(n => Number(n)).filter(n => !Number.isNaN(n))));

            const serverIds = new Set(serverDiagnoses.map(d => d.toothId));
            const missingProblems = uniqueMissing
                .filter(n => !serverIds.has(n))
                .map(n => ({
                    toothId: n,
                    isManual: false,
                    isVerified: false,
                    prediction: "Gigi Hilang",
                    verificator_note: null
                }));

            console.log('load all data, serverIds', serverIds)
            console.log('load all data, missingProblems', missingProblems)

            const mergedProblems = [...serverDiagnoses, ...missingProblems];

            console.log('load all data, mergedProblems', mergedProblems)
            setProblematicTeeth(mergedProblems);

            console.log('load all data, preds', preds)
            const normalizeProblem = (prob) => ({
                toothId: Number(prob?.toothId ?? prob?.number ?? null),
                number: Number(prob?.number ?? prob?.toothId ?? null),
                isManual: !!prob?.isManual,
                isVerified: !!prob?.isVerified,
                prediction: prob?.prediction ?? null,
                verificator_note: prob?.verificator_note ?? null,
                accuracy: prob?.accuracy ?? null,
                urlImage: prob?.urlImage ?? prob?.url_image ?? null,
                urlImageSquare: prob?.urlImageSquare ?? null,
                isDuplicate: prob?.isDuplicate ?? false,
                isMissing: (prob?.prediction === "Gigi Hilang") || !!prob?.isMissing,
                isProblematic: prob?.isProblematic ?? false
            });
            if (Array.isArray(preds.show_odontogram) && preds.show_odontogram.length > 0) {
                const upperTeeth = preds.show_odontogram
                    .map((odonUp) => {
                        return normalizeProblem({...odonUp, isProblematic: true});
                    })
                    .filter((it) => customOrderUp.includes(Number(it.number)))
                    .sort((a, b) => customOrderUp.indexOf(Number(a.number)) - customOrderUp.indexOf(Number(b.number)));
                const lowerTeeth = preds.show_odontogram
                    .map((odonDown) => {
                        return normalizeProblem({...odonDown, isProblematic: true});
                    })
                    .filter((it) => customOrderDown.includes(Number(it.number)))
                    .sort((a, b) => customOrderDown.indexOf(Number(a.number)) - customOrderDown.indexOf(Number(b.number)));

                setOdontogramUp(upperTeeth);
                setOdontogramDown(lowerTeeth);

                console.log('Odontogram UP load all data now:', upperTeeth);
                console.log('Odontogram DOWN load all data now:', lowerTeeth);
            } else {
                const upperTeeth = customOrderUp
                    .map((custUp) => {
                        const found = mergedProblems.find((p) => Number(p.toothId) === custUp);
                        if (found) return normalizeProblem({...found, isProblematic: true});
                        return normalizeProblem({
                            toothId: custUp,
                            number: custUp,
                            isManual: false,
                            isVerified: false,
                            prediction: null,
                            verificator_note: null,
                            isProblematic: false
                        });
                    })
                    .filter((it) => customOrderUp.includes(Number(it.number)))
                    .sort((a, b) => customOrderUp.indexOf(Number(a.number)) - customOrderUp.indexOf(Number(b.number)));

                const lowerTeeth = customOrderDown
                    .map((custDown) => {
                        const found = mergedProblems.find((p) => Number(p.toothId) === custDown);
                        if (found) return normalizeProblem({...found, isProblematic: true});
                        return normalizeProblem({
                            toothId: custDown,
                            number: custDown,
                            isManual: false,
                            isVerified: false,
                            prediction: null,
                            verificator_note: null,
                            isProblematic: false
                        });
                    })
                    .filter((it) => customOrderDown.includes(Number(it.number)))
                    .sort((a, b) => customOrderDown.indexOf(Number(a.number)) - customOrderDown.indexOf(Number(b.number)));

                setOdontogramUp(upperTeeth);
                setOdontogramDown(lowerTeeth);

                console.log('Odontogram UP load all data (fallback):', upperTeeth);
                console.log('Odontogram DOWN load all data (fallback):', lowerTeeth);
                // setOdontogramUp([]);
                // setOdontogramDown([]);
            }

            setOdontogramImage(fetchedData);
            setLubang(uniqueMissing);

        } catch (err) {
            console.error("loadAllData error:", err);
            // fallbacks
            setOdontogramUp([]);
            setOdontogramDown([]);
            setOdontogramImage({});
            setLubang([]);
            setProblematicTeeth([]);
        } finally {
            setComponentKey(k => k + 1);
        }
    };
  const handleOpenConfirmDiagnosaModal = (tooth) => {
      setSelectedDiagnosa(tooth)
      setOpenConfirmDiagnosaModal(true)
  }
  const handleCloseConfirmDiagnosaModal = () => {
      setSelectedDiagnosa({})
      setOpenConfirmDiagnosaModal(false)
  }

  const handleOpenManualDiagnosaModal = () => {
      setSelectedDiagnosa({})
      setIsModalManualDiagnose(true)
  }

  const handleCloseManualDiagnosaModal = () => {
      setSelectedDiagnosa({})
      setIsModalManualDiagnose(false)
  }

  const handleOpenVerifiedDiagnosaModal = (tooth) => {
      setSelectedDiagnosa(tooth)
      setIsOpenVerifiedDiagnosaModal(true)
  }

  const handleCloseVerifiedDiagnosaModal = () => {
      setSelectedDiagnosa({})
      setIsOpenVerifiedDiagnosaModal(false)
  }


    const handleOdontogramDiagnose = (tooth, isDelete = true) => {
        if (!tooth) return;
        const toothIdNum = toNum(tooth.toothId);
        if (toothIdNum === null) return;

        setProblematicTeeth(prev => {
            const prevArr = Array.isArray(prev) ? [...prev] : [];

            const idx = prevArr.findIndex(t => toNum(t.toothId) === toothIdNum);

            if (isDelete) {
                if (idx !== -1) {
                    prevArr.splice(idx, 1);
                }
                return prevArr;
            }

            const newEntry = {
                toothId: toothIdNum,
                isManual: !!tooth.isManual,
                isVerified: !!tooth.isVerified,
                prediction: tooth.prediction ?? "",
                verificator_note: tooth.verificator_note ?? ""
            };

            if (idx !== -1) {
                prevArr[idx] = newEntry;
            } else {
                prevArr.push(newEntry);
            }
            return prevArr;
        });

        const toothNumber = toothIdNum;
        const isOdontogramUp = customOrderUp.includes(toothNumber);

        const updateSingleArray = (setter, orderArray) => {
            setter(prev => {
                const prevArr = Array.isArray(prev) ? [...prev] : [];

                const idx = prevArr.findIndex(d => toNum(d.number) === toothNumber);
                const found = idx !== -1 ? prevArr[idx] : null;

                const newObj = {
                    ...(found || { number: toothNumber }),
                    accuracy: isDelete ? 0.99 : null,
                    manualDiagnosis: tooth.prediction ?? (found?.manualDiagnosis ?? null)
                };

                if (idx !== -1) {
                    prevArr[idx] = newObj;
                    return prevArr;
                }

                return insertInOrder(prevArr, newObj, orderArray);
            });
        };

        if (isOdontogramUp) {
            updateSingleArray(setOdontogramUp, customOrderUp);
        } else {
            updateSingleArray(setOdontogramDown, customOrderDown);
        }
    };

    const handleFinalisasiAttempt = () => {
        const problems = Array.isArray(problematicTeeth) ? problematicTeeth : [];

        const unverified = problems.filter(p => p?.isVerified !== true);

        if (unverified.length > 0) {
            const ids = unverified.map(u => u.toothId ?? u.number ?? "(no-id)").slice(0, 10).join(", ");
            const more = unverified.length > 10 ? ` +${unverified.length - 10} more` : "";
            setSubmitAlert({
                open: true,
                message: `Terdapat ${unverified.length} gigi yang belum diverifikasi: ${ids}${more}. Silakan verifikasi terlebih dahulu.`,
                severity: "warning"
            });
            return;
        }

        setIsOpenFinalisasiDataModal(true);
    };

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
          getAllFromDetectionAPI();
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


    const getAllFromDetectionAPI = async () => {
        try {
            const response = await axios.get(`${apiUrl}/data`, {
                headers: {
                    // "ngrok-skip-browser-warning": "true",
                    "Accept": "application/json"
                }
            });
            const fetchedData = response.data;
            console.log("isi dari fetchdata: ", fetchedData);

            const preds = fetchedData?.predictions ?? null;

            if (preds && Array.isArray(preds.all) && preds.all.length > 0) {
                const normalizeProblem = (prob) => ({
                    toothId: Number(prob?.toothId ?? prob?.number ?? null),
                    number: Number(prob?.number ?? prob?.toothId ?? null),
                    isManual: !!prob?.isManual,
                    isVerified: !!prob?.isVerified,
                    prediction: prob?.prediction ?? null,
                    verificator_note: prob?.verificator_note ?? null,
                    accuracy: prob?.accuracy ?? null,
                    urlImage: prob?.urlImage ?? prob?.url_image ?? null,
                    urlImageSquare: prob?.urlImageSquare ?? null,
                    isDuplicate: prob?.isDuplicate ?? false,
                    isMissing: (prob?.prediction === "Gigi Hilang") || !!prob?.isMissing,
                    isProblematic: prob?.isProblematic ?? false
                });

                if (Array.isArray(preds.show_odontogram) && preds.show_odontogram.length > 0) {
                    const upperTeeth = preds.show_odontogram
                        .map((odonUp) => {
                            return normalizeProblem({...odonUp, isProblematic: true});
                        })
                        .filter((item) => customOrderUp.includes(Number(item.number)))
                        .sort((a, b) => customOrderUp.indexOf(Number(a.number)) - customOrderUp.indexOf(Number(b.number)));

                    const lowerTeeth = preds.show_odontogram
                        .map((odonDown) => {
                            return normalizeProblem({...odonDown, isProblematic: true});
                        })
                        .filter((item) => customOrderDown.includes(Number(item.number)))
                        .sort((a, b) => customOrderDown.indexOf(Number(a.number)) - customOrderDown.indexOf(Number(b.number)));

                    console.log('Odontogram UP getAllFromDetectionAPI data now:', upperTeeth);
                    console.log('Odontogram DOWN getAllFromDetectionAPI data now:', lowerTeeth);
                    setOdontogramUp(upperTeeth);
                    setOdontogramDown(lowerTeeth);
                    setOdontogramImage(fetchedData);
                } else {
                    setOdontogramUp([]);
                    setOdontogramDown([]);
                    setOdontogramImage(fetchedData);
                }

                const rawMissing = Array.isArray(preds.missing_teeth) ? preds.missing_teeth : [];
                const uniqueMissing = Array.from(new Set(rawMissing.map(n => Number(n)).filter(n => !Number.isNaN(n))));

                setLubang(uniqueMissing);

                const newProblems = uniqueMissing.map(toothId => ({
                    toothId: Number(toothId),
                    isManual: false,
                    isVerified: false,
                    prediction: "Gigi Hilang",
                    verificator_note: null
                }));

                console.log('Setting problematicTeeth (newProblems):', newProblems);
                setProblematicTeeth(newProblems);
            }
            else {
                // no predictions found
                setOdontogramUp([]);
                setOdontogramDown([]);
                setOdontogramImage({});
                setLubang([]);
                setProblematicTeeth([]);
            }
        } catch (error) {
            console.error(error);
            setOdontogramUp([]);
            setOdontogramDown([]);
            setOdontogramImage({});
            setLubang([]);
            setProblematicTeeth([]);
        } finally {
            setComponentKey(k => k + 1);
        }
    };


    const handleOdontogramToothProblemValue = (tooth_number) => {
        const toothNum = Number(tooth_number);
        if (!Array.isArray(problematicTeeth) || problematicTeeth.length === 0) return "";
        console.log('Problematich teeth number:'+ tooth_number, problematicTeeth)
        const suspectedTooth = problematicTeeth.find(p => Number(p.toothId) === toothNum);
        console.log('suspected tooth ', suspectedTooth)
        if (!suspectedTooth) return "";
        if (suspectedTooth.isManual) return suspectedTooth.prediction ?? "";
        const pred = suspectedTooth.prediction ?? "";
        const note = suspectedTooth.verificator_note ?? "";
        const finalNote = note ? `${pred}, Note:${note}` : pred;
        console.log('final suspected tooth note + ', finalNote)
        return note ? `${pred}, Note:${note}` : pred;
    }


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
  const handleListDiagnoseTeeth = (is_auto_detection = false) => {
      const isDiagnoseAlreadyVerified = data.status === 2;

      if(isDiagnoseAlreadyVerified && !is_auto_detection)
          return problematicTeeth
      else if(!isDiagnoseAlreadyVerified && !is_auto_detection)
          return problematicTeeth.filter(probTooth => probTooth.isManual)
      else if(!isDiagnoseAlreadyVerified && is_auto_detection)
          return problematicTeeth.filter(probTooth => !probTooth.isManual)
      return []
  }

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
                                      <div className={data.status === 2 ? 'd-none': 'd-flex'}>
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

                                      {(odontogramImage.gambar && data.status !== 2) && ( // Hide kalo udah di verifikasi dokter
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
                                              Odontogram Table
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
                                                      odontogramUp.map((item, index) => {

                                                          const displayNumber = item.number ?? item.toothId;
                                                          if(item.accuracy != null){
                                                              return (
                                                                  <div key={'true-up-' + displayNumber + '-' + index } className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                                      <input
                                                                          type="checkbox"
                                                                          className="btn-check"
                                                                          id={`btncheck${displayNumber}`}
                                                                          autoComplete="off"
                                                                          checked={activeCheckbox === displayNumber || teethNumber.includes(displayNumber)}
                                                                          onChange={() => handleCheckboxClick(displayNumber)}
                                                                      />
                                                                      <label
                                                                          className="btn btn-outline-secondary text-xs p-2"
                                                                          htmlFor={`btncheck${displayNumber}`}
                                                                          onClick={() => togglePopover(displayNumber)}
                                                                      >
                                                                          {item.number}
                                                                      </label>
                                                                      {activePopover === displayNumber && activeCheckbox === displayNumber && (
                                                                          <div className="popover-content">
                                                                              <p>Nomor Gigi: {displayNumber}</p>
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
                                                              )
                                                          }
                                                          else if(item.accuracy === null && item.isProblematic){
                                                              return (
                                                                  <div key={'false-up-' + index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                                      <input
                                                                          type="checkbox"
                                                                          className="btn-check"
                                                                          id={`btncheck${displayNumber}`}
                                                                          autoComplete="off"
                                                                          checked={activeCheckbox === displayNumber || teethNumber.includes(displayNumber)}
                                                                          onChange={() => handleCheckboxClick(displayNumber)}
                                                                      />
                                                                      <label
                                                                          className="btn btn-outline-danger text-xs p-2 flex items-center justify-center"
                                                                          htmlFor={`btncheck${displayNumber}`}
                                                                          onClick={() => togglePopover(displayNumber)}
                                                                      >
                                                                          {displayNumber}
                                                                      </label>
                                                                      {activePopover === displayNumber && activeCheckbox === displayNumber && (
                                                                          <div className="popover-content">
                                                                              <p>Nomor Gigi: {displayNumber}</p>
                                                                              <div className="mx-1">
                                                                                  {handleOdontogramToothProblemValue(displayNumber)}
                                                                              </div>

                                                                          </div>
                                                                      )}
                                                                  </div>
                                                              )
                                                          }
                                                          else {
                                                              return (
                                                                  <div key={'cus-up-' +index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                                      <input
                                                                          type="checkbox"
                                                                          className="btn-check"
                                                                          id={`btncheck${item}`}
                                                                          autoComplete="off"
                                                                          checked={activeCheckbox === displayNumber || teethNumber.includes(displayNumber)}
                                                                          onChange={() => handleCheckboxClick(displayNumber)}
                                                                      />
                                                                      <label
                                                                          className="btn btn-outline text-xs p-2 flex items-center justify-center"
                                                                      >
                                                                          {displayNumber}
                                                                      </label>
                                                                  </div>
                                                              )
                                                          }
                                                      }
                                                      )
                                                    ) : (
                                                      customOrderUp.map((item, index) => (
                                                        <div key={'cus-up-' +index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                          <input
                                                            type="checkbox"
                                                            className="btn-check"
                                                            id={`btncheck${item}`}
                                                            autoComplete="off"
                                                            checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                            onChange={() => handleCheckboxClick(item.number)}
                                                          />
                                                          <label
                                                            className="btn btn-outline text-xs p-2 flex items-center justify-center"
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
                                                      odontogramDown.map((item, index) => {

                                                          const displayNumber = item.number ?? item.toothId;
                                                          if(item.accuracy != null){
                                                              return (
                                                                  <div key={'true-down-' + displayNumber + '-' + index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                                      <input
                                                                          type="checkbox"
                                                                          className="btn-check"
                                                                          id={`btncheck${displayNumber}`}
                                                                          autoComplete="off"
                                                                          checked={activeCheckbox === displayNumber || teethNumber.includes(displayNumber)}
                                                                          onChange={() => handleCheckboxClick(displayNumber)}
                                                                      />
                                                                      <label className="btn btn-outline-secondary text-xs p-2"
                                                                             htmlFor={`btncheck${displayNumber}`}
                                                                             onClick={() => togglePopover(displayNumber)}
                                                                      >
                                                                          {displayNumber}
                                                                      </label>
                                                                      {activePopover === displayNumber && activeCheckbox === displayNumber && (
                                                                          <div className="popover-content">
                                                                              <p>Nomor Gigi: {displayNumber}</p>
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
                                                              )
                                                          }
                                                          else if(item.accuracy === null && item.isProblematic) {
                                                              return (
                                                                  <div key={'false-down-' + index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                                      <input
                                                                          type="checkbox"
                                                                          className="btn-check"
                                                                          id={`btncheck${displayNumber}`}
                                                                          autoComplete="off"
                                                                          checked={activeCheckbox === displayNumber || teethNumber.includes(displayNumber)}
                                                                          onChange={() => handleCheckboxClick(displayNumber)}
                                                                      />
                                                                      <label className="btn btn-outline-danger text-xs p-2 flex items-center justify-center"
                                                                             htmlFor={`btncheck${displayNumber}`}
                                                                             onClick={() => togglePopover(displayNumber)}
                                                                      >
                                                                          {displayNumber}
                                                                      </label>
                                                                      {activePopover === displayNumber && activeCheckbox === displayNumber && (
                                                                          <div className="popover-content">
                                                                              <p>Nomor Gigi: {displayNumber}</p>
                                                                              <div className="mx-1" >
                                                                                  {handleOdontogramToothProblemValue(displayNumber)}
                                                                              </div>
                                                                          </div>
                                                                      )}
                                                                  </div>
                                                              )
                                                          }
                                                          else {
                                                              return (
                                                                  <div key={'false-down-' + index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef}>
                                                                      <input
                                                                          type="checkbox"
                                                                          className="btn-check"
                                                                          id={`btncheck${item}`}
                                                                          autoComplete="off"
                                                                          checked={activeCheckbox === displayNumber || teethNumber.includes(displayNumber)}
                                                                          onChange={() => handleCheckboxClick(displayNumber)}
                                                                      />
                                                                      <label
                                                                          className="btn btn-outline text-xs p-2 flex items-center justify-center"
                                                                      >
                                                                          {displayNumber}
                                                                      </label>
                                                                  </div>
                                                              )
                                                          }
                                                      }
                                                      )
                                                    ) : (
                                                      customOrderDown.map((item, index) => (
                                                        <div key={'cus-down-' + index} className="popover-container d-flex justify-content-center mt-1" ref={containerRef} >
                                                          <input
                                                            type="checkbox"
                                                            className="btn-check"
                                                            id={`btncheck${item}`}
                                                            autoComplete="off"
                                                            checked={activeCheckbox === item.number || teethNumber.includes(item.number)}
                                                            onChange={() => handleCheckboxClick(item.number)}
                                                          />
                                                          <label
                                                            className="btn btn-outline text-xs p-2 flex items-center justify-center"
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
                                      {(odontogramImage?.gambar && data.status !== 2) && ( // Hide kalo udah di verifikasi dokter
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
                                                          <Tooltip title="Lihat list crop gigi" placement="top" arrow>
                                                              <Button fullWidth variant="outlined" endIcon={<ArrowCircleUpIcon
                                                                  sx={{
                                                                      transform: !showImages ? 'rotate(180deg)' : 'none',
                                                                      transition: 'transform 0.2s',
                                                                  }}
                                                              />}>
                                                                  Gambar Crop Gigi
                                                              </Button>
                                                          </Tooltip>
                                                      </div>
                                                      <div className={`card-body py-2 dropdown-body ${showImages ? 'show' : ''}`}>
                                                        {/* Odontogram Up */}
                                                        <div className="container-fluid d-flex mb-6 justify-content-center flex-wrap">
                                                          <div className="row no-gutters d-flex justify-content-center">
                                                            {odontogramUp.map((item) => (
                                                              <div key={'crop-gigi-up-' + item.number} className="col-auto flex-item text-center">
                                                                <div className="flex-column-container">
                                                                  {!item.isDuplicate && !item.isMissing ? (
                                                                    Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                      <div className="card mx-1" style={{ elevation: 1, maxWidth: '444px' }}>
                                                                        <div className="carousel slide">
                                                                          <div className="carousel-inner">
                                                                            {item.urlImage.map((img, i) => (
                                                                              <div key={'up-url-image-' + i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
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
                                                              <div key={'crop-gigi-down-' + item.number} className="col-auto flex-item text-center">
                                                                <div className="mb-2">{item.number}</div>
                                                                {!item.isDuplicate && !item.isMissing ? (
                                                                  Array.isArray(item.urlImage) && item.urlImage.length > 1 ? (
                                                                    <div className="card mx-1" style={{ elevation: 1, maxWidth: '444px' }}>
                                                                      <div className="carousel slide">
                                                                        <div className="carousel-inner">
                                                                          {item.urlImage.map((img, i) => (
                                                                            <div key={'down-url-img-' + i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
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
                                        {Array.isArray(problematicTeeth) && problematicTeeth.length > 0 ? (
                                          <div className="card-body">
                                            <p className="text-xs">
                                              Diagnosa AI (automatic Detection)
                                            </p>
                                            {handleListDiagnoseTeeth(true).map((tooth, index) => (
                                              <div className="row" key={'problematic-' + tooth.toothId}>
                                                <div className="col-2 pt-2">
                                                  <ul className="ps-3">
                                                    <li className="text-xs">
                                                      Gigi #{tooth.toothId}
                                                    </li>
                                                  </ul>
                                                </div>
                                                <div className="col-4 ps-0 pt-2">
                                                  <p className="text-xs text-dark font-weight-bold">
                                                      {tooth.prediction}
                                                  </p>
                                                </div>
                                                  <div className="col ps-0 pt-2">
                                                      <Box sx={{
                                                          display: data.status === 2 ? 'none' : 'flex',
                                                          justifyContent: 'end'
                                                      }}>
                                                          <Box sx={{
                                                              display: tooth.isVerified ? 'block' : 'none'
                                                          }}>
                                                              <Tooltip title={tooth.verificator_note} placement="top" arrow>
                                                                  <span>
                                                                      <IconButton
                                                                          size="small"
                                                                          aria='Note AI '
                                                                          disabled
                                                                      >
                                                                      <DescriptionIcon  color="warning"/>
                                                                  </IconButton>
                                                                  </span>
                                                              </Tooltip>
                                                          </Box>
                                                          <Tooltip title={tooth.isVerified ? 'Sudah diverifikasi' : 'Verifikasi Deteksi'} placement="top" arrow>
                                                              <span>
                                                                  <IconButton
                                                                      onClick={() => handleOpenVerifiedDiagnosaModal(tooth)}
                                                                      size="small"
                                                                      aria='Verif Button'
                                                                      disabled={tooth.isVerified}
                                                                  >
                                                                      <VerifiedIcon  color={tooth.isVerified ? 'default' : 'primary'}/>
                                                                  </IconButton>
                                                              </span>
                                                          </Tooltip>
                                                          <Tooltip title="Hapus Deteksi" placement="top" arrow>
                                                              <IconButton
                                                                  onClick={() => handleOpenConfirmDiagnosaModal(tooth)}
                                                                  size="small" aria='Delete Button'>
                                                                  <DeleteIcon color="error"/>
                                                              </IconButton>
                                                          </Tooltip>
                                                      </Box>
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

                                          <ConfirmDiagnosaModal
                                              isOpen={openConfirmDiagnosaModal}
                                              radiographicId={data.history_id}
                                              tooth={selectedDiagnosa}
                                              handleOdontogramDiagnose={handleOdontogramDiagnose}
                                              handleClose={handleCloseConfirmDiagnosaModal} />

                                          <VerifiedDiagnosaModal
                                              isOpen={isOpenVerifiedDiagnosaModal}
                                              radiographicId={data.history_id}
                                              tooth={selectedDiagnosa}
                                              handleOdontogramDiagnose={handleOdontogramDiagnose}
                                              handleClose={handleCloseVerifiedDiagnosaModal} />

                                        <div className="card-body">
                                          <p className="text-xs">
                                            Diagnosa {data.status === 2 ? 'Terverifikasi' : 'Manual'}
                                          </p>
                                          {/*{data.diagnoses?.map((diagnose) => {*/}
                                            {console.log('diagnoose data', data)}
                                          {/*{data.diagnoses?.map((diagnose) => {
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
                                          })}*/}

                                          <div className="row mb-4">
                                            <div className="col-12">
                                              {/* <p className="text-xxs text-secondary font-weight-bold">
                                                Radiodiagnosis Verifikator
                                              </p> */}
                                              {handleListDiagnoseTeeth(false).map(
                                                (diagnose) => {
                                                    return (
                                                        <div className="row">
                                                            <div className="col-2">
                                                                <ul className="ps-3">
                                                                    <li className="text-xs">
                                                                        Gigi #
                                                                        {
                                                                            diagnose.toothId
                                                                        }
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="col-4 ps-0">
                                                                <p className="text-xs text-dark font-weight-bold mb-0 pb-2">
                                                                    {diagnose.prediction}
                                                                </p>
                                                            </div>
                                                            <div className="col ps-0">
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'end'
                                                                }}>
                                                                    <Box sx={{
                                                                        display: data.status === 2 && diagnose.verificator_note ? 'block' : 'none'
                                                                    }}>
                                                                        <Tooltip title={diagnose.verificator_note} placement="top" arrow>
                                                                          <span>
                                                                              <IconButton
                                                                                  size="small"
                                                                                  aria='Note AI '
                                                                                  disabled
                                                                              >
                                                                                    <DescriptionIcon  color="warning"/>
                                                                              </IconButton>
                                                                          </span>
                                                                        </Tooltip>
                                                                    </Box>
                                                                    <Box sx={{
                                                                        display: data.status === 2 && !diagnose.isManual ? 'block' : 'none'
                                                                    }}>
                                                                        <Tooltip title="Hasil deteksi otomatis (sudah diverifikasi)" placement="top" arrow>
                                                                          <span>
                                                                              <IconButton
                                                                                  size="small"
                                                                                  aria='Hasil AI AI '
                                                                                  disabled
                                                                              >
                                                                                    <SmartToyIcon  color="primary"/>
                                                                              </IconButton>
                                                                          </span>
                                                                        </Tooltip>
                                                                    </Box>
                                                                    <Box sx={{
                                                                        display: data.status === 2 && diagnose.isManual ? 'block' : 'none'
                                                                    }}>
                                                                        <Tooltip title="Hasil manual dokter" placement="top" arrow>
                                                                          <span>
                                                                              <IconButton
                                                                                  size="small"
                                                                                  aria='Manual '
                                                                                  disabled
                                                                              >
                                                                                    <PersonIcon  color="primary"/>
                                                                              </IconButton>
                                                                          </span>
                                                                        </Tooltip>
                                                                    </Box>
                                                                    <Box sx={{
                                                                        display: data.status !== 2 ? 'block' : 'none'
                                                                    }}>
                                                                        <Tooltip title="Hapus Deteksi" placement="top" arrow>
                                                                            <IconButton
                                                                                onClick={() => handleOpenConfirmDiagnosaModal(diagnose)}
                                                                                size="small" aria='Delete Button'>
                                                                                <DeleteIcon color="error"/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
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
                                                    );
                                                }
                                              )}
                                            </div>
                                          </div>

                                          <div className={data.status === 2 ? 'd-none': 'd-grid'}>
                                            <button
                                              className="btn btn-sm btn-primary mt-2 mb-4"
                                              type="button"
                                              onClick={() => handleOpenManualDiagnosaModal()}
                                            >
                                              Tambah Diagnosa
                                            </button>
                                            <InterpretasiManual
                                              customOrderUp={customOrderUp}
                                              customOrderDown={customOrderDown}
                                              isOpenModalManualDiagnose={isOpenModalManualDiagnose}
                                              radiographicId={data.history_id}
                                              tooth={selectedDiagnosa}
                                              problematicTeeth={problematicTeeth}
                                              handleOdontogramDiagnose={handleOdontogramDiagnose}
                                              handleCloseManualDiagnosaModal={handleCloseManualDiagnosaModal}
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
                                                    data.status === 2 && catatanPasien  ? catatanPasien : "Catatan Pasien"
                                                  }
                                                  rows="5"
                                                  value={catatanPasien}
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
                                          <div className={data.status === 2 ? 'd-none': 'd-grid'}>
                                            <button
                                              className="btn btn-sm btn-success mt-4 mb-2"
                                              onClick={handleFinalisasiAttempt}
                                              type="button"
                                            >
                                              Finalisasi Data
                                            </button>
                                            <FinalisasiData
                                                open={isOpenFinalisasiDataModal}
                                                onClose={() => setIsOpenFinalisasiDataModal(false)}
                                                radiographicId={data.history_id}
                                                catatanPasien={catatanPasien}
                                                problematicTeeth={problematicTeeth}
                                                onSuccess={() => {
                                                    // getAll()
                                                }}
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
          <Snackbar
              open={submitAlert.open}
              autoHideDuration={6000}
              onClose={() => setSubmitAlert(prev => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
              <Alert
                  onClose={() => setSubmitAlert(prev => ({ ...prev, open: false }))}
                  severity={submitAlert.severity}
                  sx={{ width: "100%" }}
              >
                  {submitAlert.message}
              </Alert>
          </Snackbar>
      </div >
    );
  } else {
    return <div></div>;
  }
};

export default ViewGambarPanoramikDokter;
