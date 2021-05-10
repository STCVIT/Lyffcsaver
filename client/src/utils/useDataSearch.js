import { useEffect, useState } from "react";
import axios from "axios";

export default function useDataSearch(queries, endpoint) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setData([]);
  }, [queries.query, queries.course]);

  useEffect(() => {
    if (queries.course === undefined || queries.course !== "") {
      setLoading(true);
      setError(false);
      let cancel;
      axios({
        method: "GET",
        url: `/${endpoint}`,
        params: queries,
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          const { [endpoint]: newData, hasMore } = res.data;

          setData((prevData) => {
            return [...new Set([...prevData, ...newData])];
          });
          setHasMore(hasMore);
          setLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          setError(true);
        });
      return () => cancel();
    }
  }, [queries.query, queries.course, queries.pageNumber]);

  return { loading, error, data, hasMore };
}
