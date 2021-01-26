import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import { firestore } from "../../config/fire";
import fetchDateNow from "../../utils/fetchDateNow";
import FullscreenButton from "../FullscreenButton";
import ImportVideoButton from "../ImportVideoButton";
import PlayButton from "../PlayButton";
import Slider from "../SliderVideo";
import Timer from "../Timer";
import VolumeButton from "../VolumeButton";
import styles from "./video.module.css";

const Video = (props) => {
  //TODO Arrumar FullScreen
  const video = useRef(null);
  const videoPlayer = useRef(null);
  const videoControls = useRef(null);
  const [
    doc,
    setDoc,
  ] = useState<firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | null>(
    null
  );
  const [src, setSrc] = useState(props.src ?? "");
  const [fullscreen, setFullscreen] = useState(false);
  const [play, setPlay] = useState(props.play ?? false);
  const [playLoading, setPlayLoading] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const [userInteraction, setUserInteraction] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const handlePlay = async () => {
    if (!playLoading) {
      setPlayLoading(true);
      if (!play) {
        doc
          .set({
            currentTime: videoCurrentTime,
            play: !play,
            date: await fetchDateNow(),
            src,
          })
          .finally(() => setPlayLoading(false));
      } else {
        doc
          .set({
            currentTime: videoCurrentTime,
            play: !play,
            date: await fetchDateNow(),
            src,
          })
          .finally(() => setPlayLoading(false));
      }
    }
  };
  const TimeUpdate = (e) => {
    setVideoCurrentTime(e.currentTarget.currentTime);
    if (
      e.currentTarget.duration !== videoDuration &&
      !Number.isNaN(e.currentTarget.duration)
    )
      setVideoDuration(e.currentTarget.duration);
  };
  const handleVolumeChange = (value) => {
    setVolume(value);
  };
  const handleMuted = () => {
    setMuted(!muted);
  };
  useEffect(() => {
    //Detect user interation
    document.onmousemove = () => {
      setUserInteraction(true);
      document.onmousemove = null;
    };

    //Firestore
    let id = window.location.pathname;
    id = id.replace("/v/", "");
    let doc = firestore.collection("video").doc(id);
    setDoc(doc);
    var unsub = doc.onSnapshot(async (snapshot) => {
      if (snapshot.exists) {
        const { src, play, currentTime, date } = snapshot.data();
        if (!!src) setSrc(src);
        if (typeof play === "boolean") {
          setPlay(play);
          if (typeof currentTime === "number" && date) {
            (video.current as HTMLVideoElement).currentTime =
              currentTime + (play ? ((await fetchDateNow()) - date) / 1000 : 0);
          }
        }
      }
    });
    //Animation opacity
    let divVideoPlayer = videoPlayer.current as HTMLDivElement;
    let handleTimeout;
    let controls = videoControls.current as HTMLDivElement;
    let closeControl = () => {
      controls.style.opacity = "0";
      divVideoPlayer.style.cursor = "none";
    };
    let listiner = () => {
      controls.style.opacity = "1";
      divVideoPlayer.style.cursor = "initial";
      clearTimeout(handleTimeout);
      handleTimeout = setTimeout(closeControl, 2000);
    };
    divVideoPlayer.ontouchstart = listiner;
    divVideoPlayer.onmousemove = listiner;
    divVideoPlayer.onmouseout = closeControl;
    return () => {
      unsub();
      document.onmousemove = null;
      divVideoPlayer.ontouchstart = null;
      divVideoPlayer.onmouseout = null;
      divVideoPlayer.onmousemove = null;
      clearTimeout(handleTimeout);
    };
  }, []);
  useEffect(() => {
    (video.current as HTMLVideoElement).volume = volume;
  }, [volume]);
  useEffect(() => {
    (video.current as HTMLVideoElement).muted = muted;
  }, [muted]);
  useEffect(() => {
    video.current.controls = false;
  }, [video?.current?.controls]);
  useEffect(() => {
    (async () => {
      let videoDOM = video.current as HTMLVideoElement;

      if (canPlay) {
        try {
          if (play) {
            videoDOM.muted = true;
            await videoDOM?.play();
            if (userInteraction) videoDOM.muted = muted;
          } else {
            videoDOM?.pause();
          }
        } catch (error) {}
      }
    })();
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
          preload="auto"
          src={src}
          className={styles.video}
          ref={video}
          playsInline
          onLoadedMetadata={TimeUpdate}
          onTimeUpdate={TimeUpdate}
          autoPlay={play}
          onCanPlay={() => setCanPlay(true)}
          muted
        />
      </div>
      <ImportVideoButton />
      <div ref={videoControls} className={styles.videoPlayerGrid + " p-2"}>
        <Slider
          videoCurrentTime={videoCurrentTime}
          videoDuration={videoDuration}
          onChange={async (e) => {
            video.current.currentTime = e.target.value;
            doc.update({
              currentTime: Number(e.target.value),
              date: await fetchDateNow(),
            });
          }}
        />
        <div className={styles.videoPlayerRow + " text-white"}>
          <div onClick={handlePlay}>
            <PlayButton play={play} loading={playLoading} />
          </div>
          <VolumeButton
            volume={volume}
            muted={muted}
            {...{ handleVolumeChange, handleMuted }}
          />
          <Timer
            videoCurrentTime={Math.floor(videoCurrentTime)}
            videoDuration={Math.floor(videoDuration)}
          />
          <div onClick={() => setFullscreen(!fullscreen)}>
            <FullscreenButton fullscreen={fullscreen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
