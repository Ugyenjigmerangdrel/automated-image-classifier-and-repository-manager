import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_HEAD = import.meta.env.VITE_API;

const Repository = () => {
  const { userToken } = useAuth();
  const [repo, setRepo] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchRepositories() {
      const response = await fetch(API_HEAD + "/api/images/list_repo", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();
      const resData = data.repo;
      setRepo(resData);
    }

    fetchRepositories();
  }, [userToken]);

  const handleOnSelectRepo = (repo_id) => {
    navigate("/photos/" + repo_id);
  };
  console.log(repo);
  return (
    <div className="m-auto w-[80vw] p-5">
      <h1 className="text-3xl mb-5">Albums</h1>
      <div className="border border-gray-300 rounded-lg">
        <div className="grid grid-cols-4 gap-4 p-3 border-b border-gray-200 font-semibold text-gray-700">
          <div className="col-span-2">Name</div>
          <div>Owner</div>
          <div>Action</div>
        </div>
        {repo.length !== 0 &&
          repo.map((folder, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 p-3 border-b border-gray-200 hover:bg-gray-100"
            >
              <div
                className="col-span-2 flex items-center space-x-3"
                onClick={() => handleOnSelectRepo(folder.repo_id)}
              >
                <span className="text-gray-500">
                  <i className="fa-solid fa-folder"></i>
                </span>
                <span>{folder.repo_name}</span>
              </div>
              <div className="flex items-center">{folder.owner_email}</div>
              <div className="flex items-center">
                <button className="p-2">
                  <i className="text-gray-500 fa-solid fa-trash"></i>
                </button>
                <button className="p-2">
                  <i className="text-gray-500 fa-solid fa-pen"></i>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Repository;
