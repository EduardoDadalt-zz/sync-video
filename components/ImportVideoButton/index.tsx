import Image from "next/image";
import { useRouter } from "next/router";
import React, { FormEvent, memo, useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";
const ImportVideoButton = () => {
  const router = useRouter();
  const path = router.query.id;
  const inputUrl = useRef(null);
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      fetch("/api/sendSrc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, path }),
      }).finally(() => {
        setLoading(false);
        setShow(false);
        setUrl("");
      });
    }
  };
  useEffect(() => {
    if (show) {
      (inputUrl.current as HTMLInputElement).focus();
    }
  }, [show]);
  return (
    <>
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>Envie seu vídeo</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                ref={inputUrl}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://example.com/"
              />
            </Form.Group>
            <Button type="submit" className="btn-block" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Send"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Button
        className={styles.position}
        variant="outline-dark"
        onClick={() => setShow(true)}
      >
        <Image
          src="/icons/share.svg"
          height={24}
          width={24}
          alt="Import Videos icon"
        />
      </Button>
    </>
  );
};

export default memo(ImportVideoButton);
