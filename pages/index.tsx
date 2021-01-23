import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link";
import { GetServerSideProps } from "next";
const Index = ({ id }) => {
  const [url, setUrl] = useState(id ?? "");
  return (
    <div>
      <Container className="my-5">
        <Form.Row>
          <Form.Label>EE</Form.Label>
          <Form.Control value={url} onChange={(e) => setUrl(e.target.value)} />
        </Form.Row>
        <Form.Row>
          <Link href={"/v/" + url}>
            <Button className="btn-block">Entrar na sala</Button>
          </Link>
        </Form.Row>
      </Container>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const letters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const id = Array.from({ length: 10 })
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("");
  return { props: { id } };
};

export default Index;
