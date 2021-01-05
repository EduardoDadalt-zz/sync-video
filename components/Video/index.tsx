import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./video.module.css";
const Video = () => {
  const video = useRef(null);
  const videoPlayer = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (videoPlayer) {
      let videoDOM = videoPlayer.current as HTMLVideoElement;
      if (videoDOM.requestFullscreen) {
        videoDOM.requestFullscreen();
      } else if (videoDOM.webkitRequestFullscreen) {
        videoDOM.webkitRequestFullscreen();
      } else if (videoDOM.msRequestFullscreen) {
        videoDOM.msRequestFullscreen();
      }
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen();
    };
  }, [fullscreen]);
  return (
    <div ref={videoPlayer}>
      <video src="/" controls ref={video}></video>
      <div className={styles.videoPlayerGrid}>
        <div
          onClick={() => {
            setPlay(!play);
          }}
        >
          <Image
            src={"/icons/" + (!play ? "play.svg" : "pause.svg")}
            height={24}
            width={24}
            layout="fixed"
          />
        </div>
        <div>
          <Form.Control type="range" custom></Form.Control>
        </div>
        <div
          onClick={() => {
            setFullscreen(!fullscreen);
          }}
        >
          <Image
            src={"/icons/" + (!fullscreen ? "maximize.svg" : "minimize.svg")}
            height={24}
            width={24}
            layout="fixed"
          />
        </div>
      </div>
    </div>
  );
};

export default Video;
