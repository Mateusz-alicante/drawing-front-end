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
      privacy: "public",
    },
    onSubmit: () => {
      console.log(formik.values);
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
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/createPost`,
        {
          description: fv.description,
          privacy: fv.privacy,
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

  const handleRadioButtons = (e) =>
    formik.setFieldValue("privacy", e.target.value);

  const svgCallback = (svg) => {
    var s = new XMLSerializer().serializeToString(svg.current);
    var encodedData = window.btoa(s);
    console.log(`data:image/svg+xml;base64,${encodedData}`);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.signupCard}>
        <div hidden={!submitted} className="alert alert-primary" role="alert">
          {message}
        </div>

        <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
          <h1>Register new Drawing:</h1>
          <div className={styles.mb3}>
            <label htmlFor="description" className={styles.formLabel}>
              <h1 className={styles.formLabel}>Title:</h1>
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
            {renderImg && (
              <Drawing
                originalData={savedDrawing}
                svgRefCallback={svgCallback}
              />
            )}
          </div>
          <div className={styles.radioInput}>
            <fieldset>
              <div className={styles.privacyContainer}>
                <legend>
                  <h1 className={styles.formLabel}>
                    Who is allowed to see the post?
                  </h1>
                </legend>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    value="public"
                    checked
                    className={styles.privacySingleRadio}
                    onChange={handleRadioButtons}
                  />{" "}
                  Everyone
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    value="friends"
                    onChange={handleRadioButtons}
                  />{" "}
                  Friends
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    value="private"
                    onChange={handleRadioButtons}
                  />{" "}
                  Just me
                </label>
              </div>
            </fieldset>
          </div>
          <button type="submit" className={styles.button}>
            SUBMIT!
          </button>
        </form>
      </div>
    </div>
  );
};
