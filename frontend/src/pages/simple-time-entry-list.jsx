import { useState, useEffect } from "react";

export default function SimpleTimeEntriesList({ userId }) {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    try {
      //   setLoading(true);
      //   const response = await fetch(
      //     `http://localhost:3000/api/user/time-entries?${userId}`,
      //     {
      //       credentials: "include",
      //     }
      //   );
      setLoading(true);
      console.log("Fetching time entries for user:", userId); // Debug log

      // Stelle sicher, dass userId existiert
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await fetch(
        `http://localhost:3000/api/user/time-entries?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      console.log("Response status:", response.status); // Debug log
      console.log(
        "Request URL:",
        `http://localhost:3000/api/user/time-entries?userId=${userId}`
      ); // Debug log

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch time entries");
      }

      const data = await response.json();
      if (data.success) {
        setTimeEntries(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching time entries:", error);
      alert("Failed to load time entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start, end, breakStart, breakEnd) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    let breakDuration = 0;
    if (breakStart && breakEnd) {
      breakDuration =
        new Date(breakEnd).getTime() - new Date(breakStart).getTime();
    }

    const totalDuration =
      (endTime - startTime - breakDuration) / (1000 * 60 * 60);
    return totalDuration.toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Time Entries</h3>
        <div className="flex justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              Loading time entries...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recent Time Entries</h3>
        <button
          onClick={fetchTimeEntries}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Refresh
        </button>
      </div>

      {timeEntries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No time entries found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeEntries.map((entry) => (
            <div
              key={entry._id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {entry.client.client_name}

                  {entry.project && (
                    <span className="ml-2 text-gray-600">
                      ({entry.project})
                    </span>
                  )}
                </h4>
                <div className="text-sm text-gray-600 font-medium">
                  {calculateDuration(
                    entry.startTime,
                    entry.endTime,
                    entry.breakBeginn,
                    entry.breakEnd
                  )}{" "}
                  hours
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>📅 {formatDate(entry.startTime)}</div>
                <div>
                  🕐 {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </div>
                <div>
                  {entry.breakBeginn && entry.breakEnd ? (
                    <>
                      ⏳ {formatTime(entry.breakBeginn)} -{" "}
                      {formatTime(entry.breakEnd)}
                    </>
                  ) : (
                    "No break"
                  )}
                </div>
              </div>

              {entry.description && (
                <div className="mt-2 text-sm text-gray-600">
                  📝 {entry.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
