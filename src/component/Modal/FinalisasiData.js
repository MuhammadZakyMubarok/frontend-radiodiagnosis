import React, { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { baseURL } from "../../routes/Config";

const FinalisasiData = ({
                            open = false,
                            onClose = () => {},
                            onSuccess = null,
                            radiographicId,
                            catatanPasien,
                            problematicTeeth = []
                        }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const buildParsedData = () => {
        if (!Array.isArray(problematicTeeth)) return [];

        return problematicTeeth
            .filter(item => item && item.isVerified === true)
            .map(item => {
                const toothId = item.toothId ?? item.number ?? null;
                if (item.isManual) {
                    return {
                        tooth_number: toothId,
                        system_diagnosis: null,
                        is_corerct: 1,
                        verificator_note: item.verificator_note ?? "",
                        manual_diagnosis: null
                    };
                } else {
                    return {
                        tooth_number: toothId,
                        system_diagnosis: null,
                        is_corerct: 1,
                        verificator_note: null,
                        manual_diagnosis: item.prediction ?? ""
                    };
                }
            })
            .filter(Boolean);
    };

    const handleConfirm = async () => {
        setError("");
        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("Token tidak ditemukan. Silakan login ulang.");
            return;
        }

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const parsedData = buildParsedData();

        setLoading(true);
        try {
            console.log('parsed data', parsedData)
            console.log(parsedData)
            console.log('catatan pasien', catatanPasien)
            console.log('token', token)

            if (parsedData.length > 0) {
                await axios.post(
                    `${baseURL}/diagnoses/${radiographicId}/bulks`,
                    parsedData,
                    { headers }
                );
            }

            await Promise.all([
                axios.put(
                    `${baseURL}/radiographics/edit/${radiographicId}/catatan`,
                    catatanPasien,
                    { headers }
                ),
                axios.put(
                    `${baseURL}/radiographics/edit/${radiographicId}/status`,
                    2,
                    { headers }
                ),
            ]);

            if (typeof onSuccess === "function") {
                try {
                    onSuccess();
                    console.log('udah success tapi function')
                    window.location.href = "/dokter-radiografi-panoramik";
                } catch (e) { /* ignore parent handler errors */ }
            } else {
                console.log('udah success')
                window.location.href = "/dokter-radiografi-panoramik";
            }

            onClose();
        } catch (err) {
            console.error("Error finalizing data or setting status/bulks:", err);

            const serverMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Terjadi kesalahan saat finalisasi data. Silakan coba lagi.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!loading) {
                    setError("");
                    onClose();
                }
            }}
            aria-labelledby="finalisasi-dialog-title"
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { p: 0 } }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} variant="div">
                <Typography variant="h6">Finalisasi Data</Typography>
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        if (!loading) {
                            setError("");
                            onClose();
                        }
                    }}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <Typography color="text.secondary">
                    Apakah anda yakin ingin finalisasi data analisa ini?
                </Typography>

                <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                        {Array.isArray(problematicTeeth) && problematicTeeth.length > 0
                            ? `${buildParsedData().length} entri akan dikirimkan ke server (hanya yang telah diverifikasi).`
                            : "Tidak ada entri bermasalah untuk dikirimkan."}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={() => {
                        if (!loading) {
                            setError("");
                            onClose();
                        }
                    }}
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={loading}
                >
                    Tidak
                </Button>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading ? "Memproses..." : "Iya"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FinalisasiData;
