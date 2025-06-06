// Entferne useUser Import aus dieser Datei

const fetchWithAuth = async (url, options = {}, logout) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    // Token abgelaufen → refresh versuchen
    const refreshRes = await fetch(
      "http://localhost:3000/api/auth/refresh-token",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.status === 401) {
      // Wenn Unauthorized: Logout erzwingen
      // Oder globale Logout-Funktion
      logout();
      if (logout) logout();
      throw new Error("Session expired");
    }

    if (refreshRes.ok) {
      // Retry
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    } else {
      throw new Error("Refresh fehlgeschlagen");
    }
  }

  return res;
};

export default fetchWithAuth;
