import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./style.module.css";
const VolumeButton = ({ muted, volume, handleVolumeChange, handleMuted }) => {
  const [src, setSrc] = useState("volume-x.svg");
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    if (muted) setSrc("volume-x.svg");
    else if (volume == 0) setSrc("volume.svg");
    else if (volume < 0.5) setSrc("volume-1.svg");
    else setSrc("volume-2.svg");
  }, [muted, volume]);

  return (
    <div
      className="d-flex"
      style={{ minWidth: 24 }}
      onMouseOver={() => setShowSlider(true)}
      onMouseOut={() => setShowSlider(false)}
    >
      <div style={{ width: 24, height: 24 }} onClick={handleMuted}>
        <Image src={"/icons/" + src} height={24} width={24} />
      </div>

      <Form.Control
        type="range"
        step={0.05}
        max={1}
        min={0}
        value={muted ? 0 : volume}
        style={{ width: 0, opacity: 0 }}
        className={showSlider && styles.sliderAudio}
        onChange={(e) => {
          if (muted) handleMuted();
          handleVolumeChange(e.target.value);
        }}
      />
    </div>
  );
};

export default memo(
  VolumeButton,
  (prevProps, nextProps) =>
    prevProps.muted === nextProps.muted && prevProps.volume === nextProps.volume
);
