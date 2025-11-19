import { React, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { baseURL } from "../../../routes/Config";
import { useParams, Link } from "react-router-dom";
// import WithAuthorization from "../../../utils/auth";

const Report = () => {
    // const auth = WithAuthorization(["doctor"]);

    const [data, setData] = useState({});
    const [system, setSystem] = useState([]);
    const [manual, setManual] = useState([]);
    const [verificator, setVerificator] = useState([]);
    const [missingteeth, setMissingteeth] = useState([]);
    const [persistensi, setPersistensi] = useState([]);
    const [impaksi, setImpaksi] = useState([]);

    const missingteethnumbers = missingteeth.map(diagnose => diagnose.tooth_number).join(', ');
    const persistensinumbers = persistensi.map(diagnose => diagnose.tooth_number).join(', ');
    const impaksinumbers = impaksi.map(diagnose => diagnose.tooth_number).join(', ');

    const { id } = useParams();
    const token = sessionStorage.getItem("token");

    const mappingDiagnoses = (diagnoses) => {
        let systemDiagnosis = [];
        let manualDiagnosis = [];
        let verificatorDiagnosis = [];

        diagnoses.map((diagnosis) => {
            systemDiagnosis.push({
                tooth: diagnosis.tooth_number,
                diagnosis: diagnosis.system_diagnosis,
            });

            manualDiagnosis.push({
                tooth: diagnosis.tooth_number,
                diagnosis: diagnosis.manual_diagnosis,
            });

            verificatorDiagnosis.push({
                tooth: diagnosis.tooth_number,
                diagnosis: diagnosis.verificator_diagnosis,
            });
        });

        setSystem(systemDiagnosis);
        setManual(manualDiagnosis);
        setVerificator(verificatorDiagnosis);
    };

    console.log(data);

    useEffect(() => {
        axios
            .get(`${baseURL}/radiographics/detail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.data) {
                    setData(response.data.data);
                    mappingDiagnoses(response.data.data.diagnoses);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(`${baseURL}/radiographics/diagnoses/missingteeth/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.data) {
                    setMissingteeth(response.data.data);
                    console.log(response.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(`${baseURL}/radiographics/diagnoses/persistensi/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.data) {
                    setPersistensi(response.data.data);
                    console.log(response.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(`${baseURL}/radiographics/diagnoses/impaksi/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.data) {
                    setImpaksi(response.data.data);
                    console.log(response.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const toBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    useEffect(() => {
        const fetchImageBase64 = async () => {
            const base64Image = await toBase64(`${baseURL + data.panoramik_picture}`);
            setData({ ...data, panoramik_picture_base64: base64Image });
        };

        if (data.panoramik_picture) {
            fetchImageBase64();
        }
    }, [data.panoramik_picture]);

    const formattedDate = new Date(data.updated_at).toLocaleDateString('id-ID');


    return (
        <div id="report">
            <h6 className="ms-11 mt-2">Radiodiagnosis Report</h6>
            <hr
                style={{
                    height: "1px",
                    borderWidth: "0 px",
                    color: "gray",
                    backgroundColor: "gray",
                    marginBottom: "0 px",
                    marginStart: "0 px",
                    width: "100 px",
                }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 1.5rem' }}>
                <div style={{ paddingBottom: '0.5rem', paddingTop: '0', marginLeft: '1.5rem' }}>
                    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ width: '100%' }}>
                            <div style={{ paddingBottom: '0.5rem', paddingTop: '0' }}>
                                {/* Bagian Rekam Medik */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000' }}>Rekam Medik</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 'bold' }}>
                                        Gambar Panoramik Gigi
                                    </p>

                                    <img
                                        style={{
                                            width: '500px', // atau ukuran yang sesuai
                                            height: 'auto', // menjaga rasio aspek gambar
                                            objectFit: 'contain', // memastikan gambar fit dengan proporsional di dalam kontainer tanpa terpotong
                                            paddingLeft: '0',
                                            paddingBottom: '1rem',
                                            borderRadius: '0.375rem',
                                            alignContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        src={data.panoramik_picture_base64}
                                        alt="Panoramik Gigi"
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'white',
                                                    backgroundColor: 'navy'
                                                }}
                                            >
                                                LEMBAR INTERPRETASI RADIOGRAF PANORAMIK
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>No. Rekam Medis</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                color: 'black',
                                                fontSize: 10
                                            }}>: {data.medic_number}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Nama Pasien</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                color: 'black',
                                                fontSize: 10
                                            }}>: {data.fullname}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Alamat</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                color: 'black',
                                                fontSize: 10
                                            }}>: {data.address}</td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid black',
                                                    fontWeight: 'bold',
                                                    borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                    color: 'black',
                                                    fontSize: 10
                                                }}
                                            >
                                                Jenis Kelamin
                                            </td>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid black',
                                                    borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                    color: 'black',
                                                    fontSize: 10
                                                }}
                                            >: {data.gender}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Tanggal Pembacaan</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                color: 'black',
                                                fontSize: 10
                                            }}>: {formattedDate}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Umur</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                color: 'black',
                                                fontSize: 10
                                            }}>: {data.age}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                borderRight: 'none', // Menghilangkan border kanan pada kolom pertama
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Asal Rujukan</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                borderLeft: 'none', // Menghilangkan border kiri pada kolom kedua
                                                color: 'black',
                                                fontSize: 10
                                            }}>: {data.referral_origin}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'black',
                                                    backgroundColor: 'yellow'
                                                }}
                                            >
                                                AREA GIGI GELIGI & JARINGAN PENYANGGAH
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Missing Teeth/Agenesia</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {missingteethnumbers || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Persistensi</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {persistensinumbers || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Impaksi</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {impaksinumbers || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid black',
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    fontSize: 10
                                                }}
                                            >
                                                Kondisi Gigi
                                            </td>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid black',
                                                    color: 'black',
                                                    fontSize: 10
                                                }}
                                            > {data.kondisi_gigi || "-"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Kondisi Alveolar Crest-Furkasi</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.kondisi_alveolar || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Kondisi Periapikal</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.kondisi_periapikal || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'black',
                                                    backgroundColor: 'yellow'
                                                }}
                                            >
                                                AREA MAKSILA-SINUS-NASAL
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.area_maksila || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'black',
                                                    backgroundColor: 'yellow'
                                                }}
                                            >
                                                AREA MANDIBULA
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.area_mandibula || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'black',
                                                    backgroundColor: 'yellow'
                                                }}
                                            >
                                                AREA TMJ
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Bentuk Kondilus-Fossa-Eminensia</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.bentuk_kondilus || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                color: 'black',
                                                fontSize: 10,
                                                width: '25%'
                                            }}>Posisi Kondilus</td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.posisi_kondilus || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'black',
                                                    backgroundColor: 'yellow'
                                                }}
                                            >
                                                AREA RAMUS-OS VERTEBRAE
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.area_ramus || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'white',
                                                    backgroundColor: 'black'
                                                }}
                                            >
                                                KESAN
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.catatan_pasien || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                        <tr>
                                            <th
                                                colSpan="2" // Menetapkan jumlah kolom agar <th> mengisi seluruh lebar tabel
                                                style={{
                                                    textAlign: 'center',

                                                    border: '1px solid black',
                                                    color: 'white',
                                                    backgroundColor: 'black'
                                                }}
                                            >
                                                SUSPEK RADIODIAGNOSIS
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid black',
                                                color: 'black',
                                                fontSize: 10
                                            }}> {data.suspek_radiodiagnosis || "-"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;