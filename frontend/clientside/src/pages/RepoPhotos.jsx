import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const API_HEAD = import.meta.env.VITE_API;

const RepoPhotos = () => {
  const repo_id = useParams();
  const { userToken } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState();
  const [openPhoto, setOpenPhoto] = useState(null); // Track open photo

  console.log(repo_id.images);
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(
          `${API_HEAD}/api/images/repo/image/${repo_id.images}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok) {
          setError("Something Went Wrong!");
          return;
        }

        const data = await response.json();
        setError(null);
        const formattedPhotos = data.image_list.map((photo, index) => ({
          key: `${photo.image.immage_url}_${index}`,
          src: photo.image.immage_url,
          width: Number(photo.image.width),
          height: Number(photo.image.height),
          repo_name: photo.repo_name,
        }));
        setPhotos(formattedPhotos);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchPhotos();
  }, [userToken]);

  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-semibold mb-6">
        Photos in "{repo_id.images}"
      </h1>
      {error && <p className="text-red-500 font-bold">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.key} className="relative group cursor-pointer">
            <img
              src={photo.src}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover aspect-square rounded-md transition-transform duration-200 hover:scale-105"
              onClick={() => setOpenPhoto(photo)}
            />
            {/* <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm group-hover:bg-opacity-80">
              {photo.repo_name}
            </div> */}
          </div>
        ))}
      </div>

      {/* Modal for viewing photo */}
      {openPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setOpenPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={openPhoto.src}
              alt="Expanded View"
              className="w-auto h-[80vh] rounded-md"
            />
            <button
              className="absolute top-4 left-4 "
              onClick={() => setOpenPhoto(null)}
            >
              <i className="fa-solid fa-circle-xmark text-xl text-gray-200"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoPhotos;
