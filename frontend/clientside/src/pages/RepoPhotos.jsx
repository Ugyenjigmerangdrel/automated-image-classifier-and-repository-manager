import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { useAuth } from "../context/AuthContext"; // Assuming authentication context
import "./Photos.css";
import { useParams } from "react-router-dom";

const API_HEAD = import.meta.env.VITE_API;

const Photos = () => {
  const repo = useParams();
  const { userToken } = useAuth(); // Assuming Auth Context provides the token
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // Track context menu state

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `${API_HEAD}/api/images/repo/image/${repo.images}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          setError("Failed to load images.");
          return;
        }

        const data = await response.json();
        const formattedPhotos = data.image_list.map((photo, index) => ({
          key: `${photo.image.immage_url}_${index}`,
          src: photo.image.immage_url,
          width: photo.image.width,
          height: photo.image.height,
          repo_name: photo.repo_name,
        }));

        setPhotos(formattedPhotos);
      } catch (err) {
        setError("Error fetching images.");
      }
    };

    fetchPhotos();
  }, [userToken]);

  // Handlers for fullscreen view
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
  };

  const closeImageViewer = () => {
    setCurrentImageIndex(null);
  };

  const showPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (currentImageIndex < photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Context menu handlers
  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      index,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleMenuOptionClick = (option) => {
    alert(
      `Selected option: ${option} for image ${
        photos[contextMenu.index].repo_name
      }`
    );
    setContextMenu(null);
  };

  return (
    <div className="App" onClick={closeContextMenu}>
      <br />
      {error && <p className="error">{error}</p>}
      <div className="m-auto max-w-[80vw]">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {photos.map((photo, index) => (
            <div
              key={photo.key}
              className="image-container"
              onContextMenu={(event) => handleContextMenu(event, index)}
            >
              <img
                src={photo.src}
                alt={photo.repo_name}
                className="image-item"
              />
              <div className="image-overlay">{photo.repo_name}</div>
            </div>
          ))}
        </Masonry>
      </div>

      {/* Fullscreen Viewer */}
      {currentImageIndex !== null && (
        <div className="fullscreen-viewer" onClick={closeImageViewer}>
          <div
            className="viewer-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner clicks
          >
            <img
              src={photos[currentImageIndex].src}
              alt={photos[currentImageIndex].repo_name}
              className="fullscreen-image"
            />
            <button className="prev-button" onClick={showPreviousImage}>
              &#9664; {/* Left Arrow */}
            </button>
            <button className="next-button" onClick={showNextImage}>
              &#9654; {/* Right Arrow */}
            </button>
            <button className="close-button" onClick={closeImageViewer}>
              &#10005; {/* Close X */}
            </button>
          </div>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu && (
        <ul
          className="context-menu text-left"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li onClick={() => handleMenuOptionClick("View Fullscreen")}>
            View Fullscreen
          </li>
          <li onClick={() => handleMenuOptionClick("Download")}>Download</li>
          <li onClick={() => handleMenuOptionClick("Get Info")}>Get Info</li>
          <li onClick={() => handleMenuOptionClick("Rename")}>Rename</li>
          <li
            className="text-red-500"
            onClick={() => handleMenuOptionClick("Delete")}
          >
            Delete
          </li>
        </ul>
      )}
    </div>
  );
};

export default Photos;
