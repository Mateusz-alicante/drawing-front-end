"use client";
import { useAtom } from "jotai";
import { savedDrawingAtom } from "../../utils/atoms";
import { useState, useEffect } from "react";
import { userAtom } from "../../utils/atoms";
import styles from "./page.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Drawing from "../../Components/Drawing/Drawing";

import axios from "axios";

export default () => {
  const [message, setMessage] = useState(""); // This will be used to show a message if the submission is successful
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const [savedDrawing, setSavedDrawing] = useAtom(savedDrawingAtom);
  const [renderImg, setRenderImg] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    onSubmit: () => {
      console.log();
      setMessage("Form submitted");
      setSubmitted(true);
      postSubmit(formik.values);
    },
    validationSchema: yup.object({
      description: yup.string().required("Description is required"),
    }),
  });

  const postSubmit = async (fv) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/createPost`,
        {
          description: fv.description,
          image: savedDrawing,
          user: user,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      ); // send the data TO the backend post request, and then get the response BACK from the post result
      const { message, ...rest } = data; // "rest" includes all fields other than message from the post action (eg. firstname, lastName, password, etc.)
      setError("");
      router.push("/posts");
    } catch (error) {
      setError(error.response.data.message); // response is from the post route in backend
    }
  };

  useEffect(() => {
    setRenderImg(true);
  }, []);

  return (
    <div>
      <div className={styles.signupCard}>
        <div hidden={!submitted} className="alert alert-primary" role="alert">
          {message}
        </div>

        <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
          <h1>Register new Drawing:</h1>
          <div className={styles.mb3}>
            <label htmlFor="description" className="form-label">
              Title:
            </label>
            <input
              type="description"
              name="description"
              className={styles.formInput}
              placeholder="Post description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            {formik.errors.description && (
              <div>
                <div className={styles.textDanger}>
                  {formik.errors.description}
                </div>
              </div>
            )}
          </div>
          <div className="w-full h-60 mx-0 my-5">
            {renderImg && <Drawing data={savedDrawing} />}
          </div>
          <button
            type="submit"
            onClick={() => console.log("pressed")}
            className={styles.button}
          >
            SUBMIT!
          </button>
        </form>
      </div>
    </div>
  );
};
