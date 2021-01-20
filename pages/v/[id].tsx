import Head from "next/head";
import { Col, Row } from "react-bootstrap";
import Chat from "../../components/Chat";
import Video from "../../components/Video";
export default function Home() {
  return (
    <>
      <Head>
        <title>Sync Video</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row className="m-0 fullscreen">
        <Col sm={8} className="p-0 h-100">
          <Video />
        </Col>
        <Col sm={4} className="p-0">
          <Chat />
        </Col>
      </Row>
    </>
  );
}
