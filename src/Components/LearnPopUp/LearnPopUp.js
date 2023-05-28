import styles from "./LearnPopUp.module.css";

export default ({ show, setShow }) => (
  <div
    className={styles.outerContainer}
    style={{ display: show ? "flex" : "none" }}
  >
    <div className={styles.container}>
      <div className={styles.singleContainer}>
        <h1>Welcome the BLUEDRAW</h1>
        <p>
          This tutorial will show you the basic controls of the application, and
          what you can do with your completed drawings.
        </p>
      </div>
      <div className={styles.singleContainer}>
        <h2>Controls:</h2>
        <ul style={{ listStyle: "circle", paddingLeft: "2em" }}>
          <li style={{ paddingTop: "0.5em" }}>
            <div>
              <h3>Write: </h3>
              <p>
                To write on the screen simply open your palm and move your hand
                through the areas you would like to
              </p>
            </div>
          </li>
          <li style={{ paddingTop: "0.5em" }}>
            <div className={styles.singleContainer}>
              <h3>Erase a single stroke: </h3>
              <p>
                To erase the latest stroke put your hand into a "thumbs down"
                position.
              </p>
            </div>
          </li>
          <li style={{ paddingTop: "0.5em" }}>
            <div className={styles.singleContainer}>
              <h3>Erase all strokes: </h3>
              <p>
                To erase the latest stroke put your hand into a{" "}
                <a
                  style={{ textDecoration: "underline" }}
                  href="https://en.wikipedia.org/wiki/ILY_sign"
                >
                  "I love you" sign
                </a>
                , and hold this position for 5 seconds.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.singleContainer}>
        <h2>What you can do with your drawings:</h2>
        <p>
          After you finish your drawing, you can publish it to the website. You
          will be able specify an description of the post. Other people will be
          able to see the porgress you followed to draw your painting. Check it
          out! its very coll.
        </p>
      </div>
      <button className={styles.button} onClick={() => setShow(false)}>
        Close
      </button>
    </div>
  </div>
);
