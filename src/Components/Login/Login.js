import styles from "../Signup/Signup.module.css";

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
  const [pendingDrawing, setPendingDrawing] = useAtom(pendingDrawingAtom);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const loginSubmit = async (fv) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/login`,
        {
          password: fv.password,
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
      setError(error.response.data.message); // response is from the post route in backend
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    onSubmit: () => {
      setSubmitted(true);
      loginSubmit(formik.values);
    },
    validationSchema: yup.object({
      email: yup.string().email().required("email is required"),
      password: yup
        .string()
        .min(6, "Must be 6 digits or more")
        .required("Password is required"),
    }),
  });

  return (
    <div className={styles.formBody}>
      <div className={styles.signupCard}>
        <Loader show={loading} />
        <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
          <div className={styles.mb3}>
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && (
              <div>
                <div className="text-danger">{formik.errors.email}</div>
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
          <button
            className={styles.redirectButton}
            onClick={() => router.push("/signup")}
          >
            I dont have an account yet
          </button>
          <div style={{ color: "red" }}>{error}</div>
        </form>
      </div>
    </div>
  );
}
