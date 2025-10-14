import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import axios from "axios";
import {baseURL} from "../../routes/Config";
import {useState} from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ConfirmDiagnosaModal = ({isOpen, handleClose, radiographicId, tooth, handleOdontogramDiagnose}) => {
    const [error, setError] = useState(""); // State untuk menampung pesan error
    const token = sessionStorage.getItem("token");

    const confirmDelete = () => {
        const parsedData = {
            toothNumber: parseInt(tooth.toothId, 10), // Mengonversi nomor gigi ke number jika perlu
            manualDiagnosis: tooth.prediction.trim(), // Menghapus spasi ekstra
            verificator_note: tooth.verificator_note
        };

        handleOdontogramDiagnose(tooth, true)

        console.log('bearer token', token)
        axios
            .post(`${baseURL}/diagnoses/${radiographicId}/delete`, parsedData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log('ini respond modal confirm diagnose modal', res)
                handleClose()
                setError("")
            })
            .catch((err) => {
                // Menangkap error lebih detail dari respons server
                if (err.response) {
                    console.log("Response data:", err.response.data);
                    console.log("Response status:", err.response.status);
                    console.log("Response headers:", err.response.headers);

                    // Menangkap error jika ada masalah SQL seperti 'syntax error at or near "WHERE"'
                    setError(`Error ${err.response.status}: ${err.response.data.message || 'Gagal mengirim data'}`);
                } else if (err.request) {
                    console.log("Request:", err.request);
                    setError("Tidak ada respons dari server. Periksa koneksi internet Anda.");
                } else {
                    console.log("Error message:", err.message);
                    setError("Terjadi kesalahan: " + err.message);
                }
            });
    }
    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Hapus diagnosa {tooth.isManual ? 'Manual' : 'Prediksi AI'}, gigi #{tooth.toothId}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Apakah anda yakin akan menghapus diagnosa {tooth.isManual ? 'manual' : 'prediksi AI'} ini? tindakan ini tidak dapat di undo
                </DialogContentText>
                {error && <p className="text-danger">{error}</p>}
            </DialogContent>
            <DialogActions>
                <Button color='primary' onClick={handleClose}>Tidak Jadi</Button>
                <Button color='error' onClick={() => confirmDelete()} autoFocus>
                    Hapus
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDiagnosaModal;