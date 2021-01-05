import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./video.module.css";
const Video = () => {
  const video = useRef(null);
  const videoPlayer = useRef(null);
  const [src, setSrc] = useState("/video.mp4");
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const playImage = useMemo(
    () => (
      <div>
        <Image
          src={"/icons/" + (!play ? "play" : "pause") + ".svg"}
          height={24}
          width={24}
          layout="fixed"
        />
      </div>
    ),
    [play]
  );
  const fullscreenImage = useMemo(
    () => (
      <Image
        src={"/icons/" + (!fullscreen ? "maximize" : "minimize") + ".svg"}
        height={24}
        width={24}
        layout="fixed"
      />
    ),
    [fullscreen]
  );
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
    <div ref={videoPlayer} className="bg-dark w-100 h-100 position-relative">
      <video
        src={src}
        className="w-100 h-100"
        ref={video}
        onLoadedMetadata={TimeUpdate}
        onTimeUpdate={TimeUpdate}
      />
      <div className={styles.videoPlayerGrid + " px-2"}>
        <div>
          <Form.Control
            type="range"
            min={0}
            value={videoCurrentTime}
            max={videoDuration}
            onChange={(e) => {
              video.current.currentTime = e.target.value;
            }}
            step={0.001}
            custom
          ></Form.Control>
        </div>
        <div className={styles.videoPlayerRow + " text-white"}>
          <div
            onClick={() => {
              setPlay(!play);
            }}
          >
            {playImage}
          </div>
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
          <div
            onClick={() => {
              setFullscreen(!fullscreen);
            }}
          >
            {fullscreenImage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
