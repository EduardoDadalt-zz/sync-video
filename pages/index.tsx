import React from "react";
import { Button, Col, Row } from "react-bootstrap";

const Index = () => {
  return (
    <div>
      <Row>
        <Col>
          <Button className="btn-block">Entrar na sala</Button>
        </Col>
        <Col>
          <Button className="btn-block">Sala Random</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
