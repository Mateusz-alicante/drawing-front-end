import styles from "./Signup.module.css";

import { useState } from "react";
import { userAtom, pendingDrawingAtom } from "../../utils/atoms";
import { useAtom } from "jotai";

import { useFormik } from "formik";
import * as yup from "yup";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import Loader from "../Loader/Loader";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [pendingDrawing, setPendingDrawing] = useAtom(pendingDrawingAtom);

  const router = useRouter();
  const registerSubmit = async (fv) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/register`,
        {
          firstName: fv.firstName,
          lastName: fv.lastName,
          password: fv.password,
          username: fv.username,
          email: fv.email,
        }
      ); // send the data TO the backend post request, and then get the response BACK from the post result
      const { message, ...rest } = data; // "rest" includes all fields other than message from the post action (eg. firstname, lastName, password, etc.)
      setUser(rest);
      setLoading(false);
      setError("");
      if (pendingDrawing) {
        setPendingDrawing(false);
        router.push("/new");
        return;
      }
      router.push("/people");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error.response.data.message); // response is from the post route in backend
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      username: "",
    },
    onSubmit: () => {
      setSubmitted(true);
      registerSubmit(formik.values);
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      email: yup.string().email().required("email is required"),
      username: yup.string().required("username is required"),
      password: yup
        .string()
        .min(6, "Must be 6 digits or more")
        .required("Password is required"),
    }),
  });

  return (
    <div className={styles.formBody}>
      <Loader show={loading} />
      <div className={styles.signupCard}>
        <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
          <div className={styles.mb3}>
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="text"
              name="email"
              className={styles.formInput}
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && (
              <div className={styles.textDanger}>{formik.errors.email}</div>
            )}
          </div>
          <div className={styles.names}>
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
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.lastName && (
                <div className={styles.textDanger}>
                  {formik.errors.lastName}
                </div>
              )}
            </div>
          </div>

          <div className={styles.mb3}>
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              name="username"
              className={styles.formInput}
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.username && (
              <div className={styles.textDanger}>{formik.errors.username}</div>
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
          <button
            className={styles.redirectButton}
            onClick={() => router.push("/login")}
          >
            I have an account already
          </button>
          <span style={{ color: "red" }}>{error}</span>
        </form>
      </div>
    </div>
  );
}
