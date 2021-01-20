import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import FullscreenButton from "../FullscreenButton";
import PlayButton from "../PlayButton";
import Slider from "../SliderVideo";
import styles from "./video.module.css";
const Video = () => {
  const video = useRef(null);
  const videoPlayer = useRef(null);
  const [src, setSrc] = useState("/video.mp4");
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const TimeUpdate = (e) => {
    setVideoCurrentTime(e.currentTarget.currentTime);
    if (e.currentTarget.duration !== videoDuration) {
      setVideoDuration(e.currentTarget.duration);
    }
  };
  useEffect(() => {
    video.current.controls = false;
  }, [video?.current?.controls]);
  useEffect(() => {
    if (play) {
      (video.current as HTMLVideoElement)?.play();
    } else {
      (video.current as HTMLVideoElement)?.pause();
    }
  }, [play]);
  useEffect(() => {
    if (fullscreen && videoPlayer) {
      let videoDOM = videoPlayer.current as HTMLVideoElement;
      if (videoDOM.requestFullscreen) {
        videoDOM.requestFullscreen();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen();
    };
  }, [fullscreen]);

  return (
    <div ref={videoPlayer} className="h-100 position-relative">
      <div
        className={
          "h-100 w-100 d-flex align-items-center justify-content-center " +
          styles.videoBackground
        }
      >
        <video
          src={src}
          className={styles.video}
          ref={video}
          onLoadedMetadata={TimeUpdate}
          onTimeUpdate={TimeUpdate}
        />
      </div>
      <div className={styles.videoPlayerGrid + " p-2"}>
        <Slider
          videoCurrentTime={videoCurrentTime}
          videoDuration={videoDuration}
          onChange={(e) => {
            video.current.currentTime = e.target.value;
          }}
        />
        <div className={styles.videoPlayerRow + " text-white"}>
          <PlayButton
            play={play}
            onClick={() => {
              setPlay(!play);
            }}
          />
          <div>
            {(videoCurrentTime / 60 < 10 ? "0" : "") +
              Math.floor(videoCurrentTime / 60) +
              ":" +
              (videoCurrentTime % 60 < 10 ? "0" : "") +
              Math.floor(videoCurrentTime % 60)}
            /
            {(videoDuration / 60 < 10 ? "0" : "") +
              Math.floor(videoDuration / 60) +
              ":" +
              (videoDuration % 60 < 10 ? "0" : "") +
              Math.floor(videoDuration % 60)}
          </div>
          <FullscreenButton
            fullscreen={fullscreen}
            onClick={() => {
              setFullscreen(!fullscreen);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Video;
