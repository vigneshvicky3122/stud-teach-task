import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { url } from "../App";
import axios from "axios";
import Navigation from "./Navigation";

function Create() {
  var navigate = useNavigate();


  let handleSubmit = async (data) => {
    try {
      let send = await axios.post(`${url}/create`, data);

      if (send.data.status === 200) {
        window.confirm(send.data.message);
        navigate("/dashboard");
      }
      if (send.data.status === 400) {
        window.confirm(send.data.message);
      }
      if (send.data.statusCode > 400) {
        window.alert(send.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      role: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("* Required"),
      email: yup.string().email("Enter a valid email").required("* Required"),
      mobile: yup
        .string()
        .max(13, "Min & Max character allowed is 10-13")
        .min(10, "Enter a secure mobile")
        .required("* Required"),

      role: yup
        .string()
        .max(10, "Maximum character allowed is 10")
        .min(2, "Minimum Character Should be 2")
        .required("* Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  return (
    <>
      <Navigation />
      <div className="form">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Mobile</label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile}
            />
            {formik.touched.mobile && formik.errors.mobile ? (
              <div style={{ color: "red" }}>{formik.errors.mobile}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Role</label>
            <input
              id="role"
              name="role"
              type="text"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
            />
            {formik.touched.role && formik.errors.role ? (
              <div style={{ color: "red" }}>{formik.errors.role}</div>
            ) : null}
          </div>

          <div className="btn1">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn btn-dark"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Create;
