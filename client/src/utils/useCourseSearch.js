import { useEffect, useState } from "react";
import axios from "axios";

export default function useCourseSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [courses, setCourses] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setCourses([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "/courses/",
      params: { query, pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const { courses, hasMore } = res.data;
        setCourses((prevCourses) => {
          return [...new Set([...prevCourses, ...courses])];
        });
        setHasMore(hasMore);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, courses, hasMore };
}
