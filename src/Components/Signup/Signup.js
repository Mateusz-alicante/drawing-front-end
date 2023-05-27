import styles from "./Signup.module.css";

import { useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

export default function Home() {
  const [message, setMessage] = useState(""); // This will be used to show a message if the submission is successful
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
    onSubmit: () => {
      setMessage("Form submitted");
      setSubmitted(true);
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      password: yup
        .string()
        .min(6, "Must be greater than 6 digits")
        .required("Password is required"),
    }),
  });

  return (
    <div className={styles.signupCard}>
      <div hidden={!submitted} className="alert alert-primary" role="alert">
        {message}
      </div>

      <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            placeholder="First Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.firstName && (
            <div className="text-danger">{formik.errors.firstName}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            placeholder="lastName"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.lastName && (
            <div className="text-danger">{formik.errors.lastName}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            name="message"
            className="form-control"
            placeholder="Your message ..."
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.message && (
            <div className="text-danger">{formik.errors.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
