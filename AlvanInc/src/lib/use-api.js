import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

// One request per path per page load, shared by every component that asks for it.
const requests = new Map();

function loadApi(path) {
  if (!requests.has(path)) {
    const request = fetch(`${API_URL}${path}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        requests.delete(path); // let the next visit try again
        throw err;
      });
    requests.set(path, request);
  }
  return requests.get(path);
}

/**
 * Loads `path` from the backend. Until it arrives (or if it fails) `fallback` is used,
 * so the site never shows an empty page. `pick` turns the JSON into the shape the page wants.
 */
export function useApi(path, pick, fallback) {
  const [data, setData] = useState(fallback);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    loadApi(path)
      .then((json) => {
        if (alive) {
          setData(pick(json));
          setStatus("ready");
        }
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [path]);

  return { data, status };
}