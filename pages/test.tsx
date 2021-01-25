import { GetServerSideProps } from "next";
import { memo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import fetchDateNow from "../utils/fetchDateNow";

interface DateDiff {
  dateNow: number;
  fetchDate: number;
}
const Test = ({ date }) => {
  //const [diff] = useState(Date.now() - date);
  const [test, setTest] = useState<DateDiff[]>([
    {
      dateNow: Date.now(),
      fetchDate: date,
    },
  ]);
  const handleClick = async () => {
    const fetchDate = await fetchDateNow();
    const dateNow = Date.now();
    // - diff;
    setTest((prevState) => [...prevState, { fetchDate, dateNow }]);
  };

  return (
    <div className="overflow-scroll">
      {/* <Container>{diff}</Container> */}
      <Container>
        {test.map((v: DateDiff) => (
          <DateDiffDiv {...v} />
        ))}
      </Container>
      <div className="position-sticky bottom-0">
        <Button onClick={handleClick}>Fetch</Button>
      </div>
    </div>
  );
};

const DateDiffDiv = memo<DateDiff>(({ dateNow, fetchDate, ...opts }) => {
  return (
    <Row>
      <Col sm="auto">{dateNow}</Col>
      <Col sm="auto">{"-"}</Col>
      <Col sm="auto">{fetchDate}</Col>
      <Col sm="auto">{"="}</Col>
      <Col sm="auto">{dateNow - fetchDate}</Col>
    </Row>
  );
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { date: Date.now() } };
};
export default Test;
