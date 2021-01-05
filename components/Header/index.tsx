import React from "react";
import { Button, Form, Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar>
      <Navbar.Brand></Navbar.Brand>
      <Form inline>
        <Form.Control />
        <Button>Procurar</Button>
      </Form>
    </Navbar>
  );
};

export default Header;
