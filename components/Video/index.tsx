import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import { firestore } from "../../config/fire";
import FullscreenButton from "../FullscreenButton";
import ImportVideoButton from "../ImportVideoButton";
import PlayButton from "../PlayButton";
import Slider from "../SliderVideo";
import Timer from "../Timer";
import styles from "./video.module.css";
const Video = () => {
  const video = useRef(null);
  const videoPlayer = useRef(null);
  const videoControls = useRef(null);

  const [
    doc,
    setDoc,
  ] = useState<firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | null>(
    null
  );
  const [src, setSrc] = useState("/video.mp4");
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(false);
  const [playLoading, setPlayLoading] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handlePlay = () => {
    setPlayLoading(true);

    if (!playLoading) {
      if (!play) {
        //Fazer Tocar
        doc.set({ currentTime: videoCurrentTime, play: !play });
        setPlayLoading(false);
      } else {
        //Parar
        doc.set({ currentTime: videoCurrentTime, play: !play });
        setPlayLoading(false);
      }
    }
  };
  const TimeUpdate = (e) => {
    setVideoCurrentTime(e.currentTarget.currentTime);
    if (e.currentTarget.duration !== videoDuration) {
      setVideoDuration(e.currentTarget.duration);
    }
  };
  useEffect(() => {
    let id = window.location.pathname;
    id = id.replace("/v/", "");
    let doc = firestore.collection("video").doc(id);
    setDoc(doc);
    var unsub = doc.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const { src, play, currentTime } = snapshot.data();
        if (src) setSrc(src);
        if (play) setPlay(play);
        if (typeof currentTime === "number")
          (video.current as HTMLVideoElement).currentTime = currentTime;
      }
    });
    return unsub;
  }, []);
  useEffect(() => {
    if (videoPlayer && videoControls) {
      let divVideoPlayer = videoPlayer.current as HTMLDivElement;
      let handleTimeout;
      let controls = videoControls.current as HTMLDivElement;
      let closeControl = () => {
        controls.style.opacity = "0";
      };
      let listiner = () => {
        controls.style.opacity = "1";
        clearTimeout(handleTimeout);
        handleTimeout = setTimeout(closeControl, 2000);
      };
      divVideoPlayer.addEventListener("mouseout", closeControl);
      divVideoPlayer.addEventListener("mousemove", listiner);
      return () => {
        divVideoPlayer.removeEventListener("mouseout", closeControl);
        divVideoPlayer.removeEventListener("mousemove", listiner);
        clearTimeout(handleTimeout);
      };
    }
  }, [videoPlayer, videoControls]);
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
      <ImportVideoButton />
      <div ref={videoControls} className={styles.videoPlayerGrid + " p-2"}>
        <Slider
          videoCurrentTime={videoCurrentTime}
          videoDuration={videoDuration}
          onChange={(e) => {
            video.current.currentTime = e.target.value;
          }}
        />
        <div className={styles.videoPlayerRow + " text-white"}>
          <div onClick={handlePlay}>
            <PlayButton play={play} loading={playLoading} />
          </div>
          <div>
            <Timer
              videoCurrentTime={Math.floor(videoCurrentTime)}
              videoDuration={Math.floor(videoDuration)}
            />
          </div>
          <div onClick={() => setFullscreen(!fullscreen)}>
            <FullscreenButton fullscreen={fullscreen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
