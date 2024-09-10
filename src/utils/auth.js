import { redirect } from "react-router-dom";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { baseURL } from "../routes/Config";

const WithAuthorization = (allowedRoles) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${baseURL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        window.location.href = "/login-user";
      });
  }, []);

  if (!loading) {
    if (allowedRoles.includes(data.role)) {
      return true;
    } else {
      console.log(allowedRoles.includes(data.role));
      if (data.role === "admin") {
        window.location.href = "/data-user";
      } else if (data.role === "doctor") {
        window.location.href = "/dokter-data-pasien";
      } else if (data.role === "radiographer") {
        window.location.href = "/radiografer-data-pasien";
      } else {
        window.location.href = "/login-user";
      }
    }
  }
};

export default WithAuthorization;
