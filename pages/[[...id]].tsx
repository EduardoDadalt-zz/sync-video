import Head from "next/head";
import { Col, Row } from "react-bootstrap";
import Chat from "../components/Chat";
import Video from "../components/Video";
export default function Home() {
  return (
    <>
      <Head>
        <title>Sync Video</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row className="fullscreen m-0">
        <Col sm={8} className="p-0">
          <Video />
        </Col>
        <Col sm={4} className="p-0">
          <Chat />
        </Col>
      </Row>
    </>
  );
}
