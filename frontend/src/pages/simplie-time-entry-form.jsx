import { useState, useEffect } from "react";

export default function SimpleTimeEntryForm({ userId, onSuccess }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "",
    endDate: new Date().toISOString().split("T")[0],
    endTime: "",
    breakStartTime: "",
    breakEndTime: "",
    project: "",
    description: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/clients", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("Failed to load clients. Please try again.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert dates and times to ISO strings
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      // Optional break times
      let breakBeginn = null;
      let breakEnd = null;

      if (formData.breakStartTime) {
        breakBeginn = new Date(
          `${formData.startDate}T${formData.breakStartTime}`
        );
      }

      if (formData.breakEndTime) {
        breakEnd = new Date(`${formData.startDate}T${formData.breakEndTime}`);
      }

      const payload = {
        userId,
        clientId: formData.clientId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        breakBeginn: breakBeginn?.toISOString(),
        breakEnd: breakEnd?.toISOString(),
        project: formData.project,
        description: formData.description,
      };

      const response = await fetch(
        "http://localhost:3000/api/user/add-time-entry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create time entry");
      }

      const result = await response.json();

      if (result.success) {
        alert("Time entry created successfully");

        // Reset form
        setFormData({
          clientId: "",
          startDate: new Date().toISOString().split("T")[0],
          startTime: "",
          endDate: new Date().toISOString().split("T")[0],
          endTime: "",
          breakStartTime: "",
          breakEndTime: "",
          project: "",
          description: "",
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error creating time entry:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create time entry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Add Time Entry</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => handleChange("clientId", e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.client_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Break Start (Optional)
            </label>
            <input
              type="time"
              value={formData.breakStartTime}
              onChange={(e) => handleChange("breakStartTime", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Break End (Optional)
            </label>
            <input
              type="time"
              value={formData.breakEndTime}
              onChange={(e) => handleChange("breakEndTime", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project (Optional)
          </label>
          <input
            type="text"
            value={formData.project}
            onChange={(e) => handleChange("project", e.target.value)}
            placeholder="Project name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the work done"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Add Time Entry"}
        </button>
      </form>
    </div>
  );
}
