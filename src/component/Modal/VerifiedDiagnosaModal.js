import {
    Alert, AlertTitle, Box,
    Button, Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton, Snackbar, TextField,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "../../routes/Config";
import {
    CheckCircle as SuccessIcon,
    Close as CloseIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Warning as WarningIcon
} from "@mui/icons-material";

const VerifiedDiagnosaModal = ({isOpen, handleClose, radiographicId, tooth, handleOdontogramDiagnose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        toothNumber: "",
        verificator_note: "",
    });
    const [error, setError] = useState({
        open: false,
        message: "",
        severity: "error", // error, warning, info, success
        title: ""
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error"
    });
    const [fieldErrors, setFieldErrors] = useState({
        toothNumber: "",
        verificator_note: ""
    });

    const clearError = useCallback(() => {
        setError(prev => ({ ...prev, open: false, message: "", title: "" }));
        setFieldErrors({ toothNumber: "", verificator_note: "" });
    }, []);

    const showError = useCallback((message, title = "Error", severity = "error") => {
        setError({
            open: true,
            message,
            title,
            severity
        });
    }, []);

    const showSnackbar = useCallback((message, severity = "error") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    }, []);

    // Use Effect
    useEffect(() => {
        const toothNumber = tooth?.toothId ?? "";
        const note = tooth?.verificator_note ?? "";

        setData({
            toothNumber: toothNumber === null ? "" : String(toothNumber),
            verificator_note: note == null ? "" : String(note),
        });

        clearError();
    }, [tooth, clearError]);

    // Validated

    const validateField = useCallback((name, value) => {
        let error = "";

        // switch (name) {
        //     case "verificator_note":
        //         if (value.trim().length < 3) {
        //             error = "Diagnosa prediction AI minimal 3 karakter";
        //         }
        //         break;
        //     default:
        //         break;
        // }

        return error;
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: "" }));
        }

        const error = validateField(name, value);
        if (error) {
            setFieldErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [fieldErrors, validateField]);

    const validateForm = useCallback(() => {
        const newFieldErrors = {};
        let isValid = true;

        const verificatorNoteError = validateField("verificator_note", data.verificator_note);
        if (verificatorNoteError) {
            newFieldErrors.verificator_note = verificatorNoteError;
            isValid = false;
        }

        setFieldErrors(newFieldErrors);
        return isValid;
    }, [data, validateField]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            showError("Mohon perbaiki kesalahan pada form", "Validasi Gagal", "warning");
            return;
        }


        setIsLoading(true);

        try {
            handleOdontogramDiagnose({
                toothId: data.toothNumber,
                prediction: tooth.prediction,
                isManual: false,
                isVerified: true,
                verificator_note: data.verificator_note
            }, false);

            showSnackbar("Data berhasil disimpan!", "success");


        } catch (err) {
            console.error("Error occurred:", err);

            let errorMessage = "Terjadi kesalahan yang tidak diketahui";
            let errorTitle = "Error";

            if (err.request) {
                errorTitle = "Network Error";
                errorMessage = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
            } else {
                errorTitle = "Application Error";
                errorMessage = err.message || "Terjadi kesalahan dalam aplikasi";
            }

            showError(errorMessage, errorTitle);
        } finally {
            setIsLoading(false);
            handleClose()
        }
    }, [data, radiographicId, handleOdontogramDiagnose, clearError, showError, showSnackbar, validateForm]);

    const getErrorIcon = (severity) => {
        switch (severity) {
            case "error":
                return <ErrorIcon />;
            case "warning":
                return <WarningIcon />;
            case "info":
                return <InfoIcon />;
            case "success":
                return <SuccessIcon />;
            default:
                return <ErrorIcon />;
        }
    };
    return (
        <Box>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                fullScreen={fullScreen}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle variant="div">
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Interpretasi Manual
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            clearError()
                            handleClose()
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Collapse in={error.open}>
                        <Alert
                            severity={error.severity}
                            icon={getErrorIcon(error.severity)}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={clearError}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {error.title && <AlertTitle>{error.title}</AlertTitle>}
                            {error.message}
                        </Alert>
                    </Collapse>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Box sx={{ flex: '0 0 30%' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    No. Gigi
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="toothNumber"
                                    name="toothNumber"
                                    placeholder="No. gigi"
                                    value={data.toothNumber ?? ""}
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 1, max: 32 }}
                                    disabled={true}
                                />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    Tulis Diagnosa pendamping (opsional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="verificator_note"
                                    name="verificator_note"
                                    placeholder="Tulis nama penyakit"
                                    value={data.verificator_note ?? ''}
                                    onChange={handleChange}
                                    error={!!fieldErrors.verificator_note}
                                    helperText={fieldErrors.verificator_note}
                                    size="small"
                                    disabled={isLoading}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => {
                            clearError()
                            handleClose()
                        }}
                        variant="outlined"
                        size="small"
                        disabled={isLoading}
                    >
                        Batalkan
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        size="small"
                        disabled={isLoading}
                        sx={{ minWidth: 80 }}
                    >
                        {isLoading ? "Memverifikasi..." : "Verifikasi"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default VerifiedDiagnosaModal