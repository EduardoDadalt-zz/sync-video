import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { setTimeout } from "timers";
const Page404 = () => {
  const router = useRouter();
  useEffect(() => {
    var handle = setTimeout(router.push, 1000, "/");
    return () => {
      clearTimeout(handle);
    };
  }, []);

  return (
    <Container>
      <h1>404</h1>
    </Container>
  );
};

export default Page404;
