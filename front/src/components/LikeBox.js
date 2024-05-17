import React, { useState,useEffect } from "react";
import styles from "../css/LikeBox.module.css";

function LikeBox() {
  const imgSvg = {
    thumbUp: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 10H18.764C19.1049 10 19.4401 10.0871 19.7378 10.2531C20.0355 10.4191 20.2859 10.6584 20.4651 10.9484C20.6444 11.2383 20.7465 11.5692 20.7619 11.9098C20.7773 12.2503 20.7054 12.5891 20.553 12.894L17.053 19.894C16.8869 20.2265 16.6314 20.5061 16.3152 20.7014C15.999 20.8968 15.6347 21.0002 15.263 21H11.246C11.083 21 10.92 20.98 10.761 20.94L7 20M14 10V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H11.905C11.405 3 11 3.405 11 3.905C11 4.619 10.789 5.317 10.392 5.911L7 11V20M14 10H12M7 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96086 10.2107 4.46957 10 5 10H7.5"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    thumbDown: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.9988 4L13.2388 3.06C13.0802 3.02025 12.9173 3.0001 12.7538 3H8.73577C8.36428 3.00001 8.00013 3.10349 7.68415 3.29884C7.36816 3.49419 7.11283 3.77369 6.94677 4.106L3.44677 11.106C3.2944 11.4109 3.2225 11.7497 3.23788 12.0902C3.25326 12.4308 3.35541 12.7617 3.53465 13.0516C3.71388 13.3416 3.96424 13.5809 4.26197 13.7469C4.5597 13.9129 4.89491 14 5.23577 14H9.99977H11.9998M16.9988 4L16.9998 13L13.6078 18.088C13.2108 18.683 12.9998 19.381 12.9998 20.096C12.9998 20.595 12.5948 21 12.0948 21H11.9988C11.4683 21 10.9596 20.7893 10.5846 20.4142C10.2095 20.0391 9.99877 19.5304 9.99877 19V14M16.9988 4H18.9998C19.5302 4 20.0389 4.21071 20.414 4.58579C20.7891 4.96086 20.9998 5.46957 20.9998 6V12C20.9998 12.5304 20.7891 13.0391 20.414 13.4142C20.0389 13.7893 19.5302 14 18.9998 14H16.4998"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  };

  const [checked, setChecked] = useState("none");

  const handleRadioChange = (value) => {
    setChecked(value);
  };
  const handleSubmit=() =>{
    console.log("real submit");
    fetch('/api/like',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({checked:checked})
      })
  }
  useEffect(() => {
    const form = document.querySelector('#form');
    if(!form){
      console.log("noform")
    }
    return () => {
      console.log("submit");
      //form.submit();
    };
  }, []);

  return (
    <div className={styles.likeOrNotBox}>
      <form id="form" onSubmit={handleSubmit}className={styles.likeOrNotBox}>
        {checked}
        <label>
          {imgSvg.thumbUp}
          <input
            type="radio"
            name="radio"
            onChange={() => handleRadioChange("like")}
            checked={checked === "like"}
          />
        </label>
        <label>
          {imgSvg.thumbDown}
          <input
            type="radio"
            name="radio"
            onChange={() => handleRadioChange("dislike")}
            checked={checked === "dislike"}
          />
        </label>
      </form>
    </div>
  );
}

export default LikeBox;
