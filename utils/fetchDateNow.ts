interface dateNowProps {
  (baseUrl?: string): Promise<number>;
}

const fetchDateNow: dateNowProps = async (baseUrl) => {
  const res = await fetch((baseUrl ?? "") + "/api/dateNow");
  return Number(await res.text());
};
export default fetchDateNow;
