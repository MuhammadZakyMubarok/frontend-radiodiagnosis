// src/component/SatuSehatCheckPatient.js
import React, { useEffect, useState } from 'react';
import PatientService from "../../../api/satu-sehat/patient.service";

const ViewSatuSehatPatient = () => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            const patientService = PatientService();
            try {
                const response = await patientService.searchById('P02478375538');
                console.log(response)
                setPatientData(response.data);
            } catch (err) {
                console.log(err)
                setError('Failed to fetch patient data');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Patient Data</h1>
            <pre>{JSON.stringify(patientData, null, 2)}</pre>
        </div>
    );
};

export default ViewSatuSehatPatient;
