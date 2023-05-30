import styles from "../Signup/Signup.module.css";

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

  const loginSubmit = async (fv) => {
    try {
      setLoading(true);
      console.log(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/login`);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/login`,
        {
          username: fv.username,
          password: fv.password,
        }
      ); // send the data TO the backend post request, and then get the response BACK from the post result
      const { message, ...rest } = data; // "rest" includes all fields other than message from the post action (eg. firstname, lastName, password, etc.)
      setUser(rest);
      setLoading(false);
      setError("");
      router.push("/posts");
    } catch (error) {
      setError(error.response.data.message); // response is from the post route in backend
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: () => {
      setMessage("Form submitted");
      setSubmitted(true);
      loginSubmit(formik.values);
    },
    validationSchema: yup.object({
      username: yup.string().required("username is required"),
      password: yup
        .string()
        .min(6, "Must be 6 digits or more")
        .required("Password is required"),
    }),
  });

  return (
    <div className={styles.signupCard}>
      <Loader show={loading} />
      <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
        <div className={styles.mb3}>
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.username && (
            <div>
              <div className="text-danger">{formik.errors.username}</div>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faCircleExclamation}
              />
            </div>
          )}
        </div>

        <div className={styles.mb3}>
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && (
            <div className="text-danger">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Log In
        </button>
        <div style={{ color: "red" }}>{error}</div>
      </form>
    </div>
  );
}
