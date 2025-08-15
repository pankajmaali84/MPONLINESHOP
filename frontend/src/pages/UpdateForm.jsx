import { useNavigate } from "react-router-dom";

const PanList = ({ forms }) => {
  const navigate = useNavigate();

  const handleUpdateClick = (formData) => {
    navigate("/PanCardForm", { state: { isUpdate: true, formData } });
  };

  return (
    <div>
      {forms.map((form) => (
        <div key={form._id} className="border p-4 m-2">
          <p>{form.name}</p>
          <button
            onClick={() => handleUpdateClick(form)}
            className="bg-yellow-500 text-white px-4 py-1 rounded"
          >
            Update
          </button>
        </div>
      ))}
    </div>
  );
};

export default PanList;
