interface dateNowProps {
  (baseUrl?: string): Promise<number>;
}

const dateNow: dateNowProps = async (baseUrl) => {
  const res = await fetch((baseUrl ?? "") + "/api/dateNow");
  return Number(await res.text());
};
export default dateNow;
