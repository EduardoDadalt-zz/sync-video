import Head from "next/head";
import { Col, Row } from "react-bootstrap";
import Chat from "../components/Chat";
import Video from "../components/Video";

export default function Home() {
  const getTime = () => {
    let dt = new Date();
    return dt.getTime() + "|" + dt.getMilliseconds();
  };
  return (
    <>
      <Head>
        <title>Sync Video</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row className="fullscreen m-0">
        <Col md={8} className="p-0">
          <Video />
        </Col>
        <Col md={4} className="p-0">
          <Chat />
        </Col>
      </Row>
    </>
  );
}
