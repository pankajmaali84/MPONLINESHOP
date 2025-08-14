
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAndDeleteForms = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/pan/myAllPan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForms(res.data?.forms || []);
    } catch (err) {
      console.error("Error fetching forms", err);
      setForms([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/pan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Deleted successfully!");
      fetchForms(); // Refresh list
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleUpdate = (id) => {
    localStorage.setItem("updateFormId", id);
    navigate("/PanCardForm");
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My PAN Forms</h2>
      {forms.length === 0 ? (
        <p>No PAN forms found.</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li
              key={form._id}
              className="p-4 border border-gray-300 w-[300px] rounded shadow flex flex-col gap-2"
            >
              <div>
                <p><strong>Name:</strong> {form.name}</p>
                <p><strong>Mobile:</strong> {form.contactNumber}</p>
                <p><strong>DOB:</strong> {form.dob}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(form._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdate(form._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewAndDeleteForms;
