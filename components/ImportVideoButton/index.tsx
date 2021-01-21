import Image from "next/image";
import React, { FormEvent, memo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import fireAdmin from "../../config/adminFB";
import styles from "./styles.module.css";

const ImportVideoButton = () => {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <>
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>Envie seu vídeo</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://example.com/"
              />
            </Form.Group>
            <Button type="submit" className="btn-block">
              Send
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
