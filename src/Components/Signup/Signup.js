import styles from "./Signup.module.css";

import { useState } from "react";
import { userAtom } from "../../utils/atoms";
import { useAtom } from "jotai";

import { useFormik } from "formik";
import * as yup from "yup";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import Loader from "../Loader/Loader";

export default function Home() {
  const [message, setMessage] = useState(""); // This will be used to show a message if the submission is successful
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const registerSubmit = async (fv) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`http://localhost:8000/register`, {
        firstName: fv.firstName,
        lastName: fv.lastName,
        password: fv.password,
      }); // send the data TO the backend post request, and then get the response BACK from the post result
      console.log(data);
      const { message, ...rest } = data; // "rest" includes all fields other than message from the post action (eg. firstname, lastName, password, etc.)
      setUser(rest);
      setLoading(false);
      setError("");
      router.push("/posts");
    } catch (error) {
      setError(error.response.data.message); // response is from the post route in backend
    }
  };

  console.log(user);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
    onSubmit: () => {
      setMessage("Form submitted");
      setSubmitted(true);
      registerSubmit(formik.values);
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      password: yup
        .string()
        .min(6, "Must be 6 digits or more")
        .required("Password is required"),
    }),
  });

  return (
    <div>
      <Loader show={loading} />
      <div className={styles.signupCard}>
        <div hidden={!submitted} className="alert alert-primary" role="alert">
          {message}
        </div>

        <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
          <div className={styles.mb3}>
            <label htmlFor="firstName" className="form-label">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              className={styles.formInput}
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.firstName && (
              <div>
                <div className={styles.textDanger}>
                  {formik.errors.firstName}
                </div>
              </div>
            )}
          </div>

          <div className={styles.mb3}>
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              className={styles.formInput}
              placeholder="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.lastName && (
              <div className={styles.textDanger}>{formik.errors.lastName}</div>
            )}
          </div>

          <div className={styles.mb3}>
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              name="password"
              className={styles.formInput}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && (
              <div className={styles.textDanger}>{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className={styles.button}>
            SIGN UP!
          </button>
        </form>
      </div>
    </div>
  );
}
