import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Assuming authentication context
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const API_HEAD = import.meta.env.VITE_API as string;

interface Photo {
  key: string;
  src: string;
  width: number;
  height: number;
  repo_name: string;
}

const Gallery: React.FC = () => {
  const { userToken } = useAuth(); // Assuming Auth Context provides the token
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${API_HEAD}/api/images/list`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          setError("Failed to load images.");
          return;
        }

        const data = await response.json();
        const formattedPhotos: Photo[] = data.image_list.map(
          (photo: any, index: number) => ({
            key: `${photo.image.immage_url}_${index}`,
            src: photo.image.immage_url,
            width: photo.image.width,
            height: photo.image.height,
            repo_name: photo.repo_name,
          })
        );

        setPhotos(formattedPhotos);
      } catch (err) {
        setError("Error fetching images.");
      }
    };

    fetchPhotos();
  }, [userToken]);

  const handleOnClick = (url: string) => {
    alert(`Selected ${url}`);
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {photos.map((photo) => (
          <Sheet key={photo.key}>
            <ContextMenu>
              <ContextMenuTrigger className="relative group overflow-hidden shadow-md">
                
                  <img
                    src={photo.src}
                    alt={photo.repo_name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">
                      {photo.repo_name}
                    </p>
                  </div>
                
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  <SheetTrigger>Open Details</SheetTrigger>
                </ContextMenuItem>
                <ContextMenuItem className="text-red-400">Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
           
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Image Details</SheetTitle>
                <SheetDescription>
                  Here is more information about the selected image:{" "}
                  <span className="font-semibold">{photo.repo_name}</span>.
                </SheetDescription>
              </SheetHeader>
              <img
                src={photo.src}
                alt={photo.repo_name}
                className="mt-4 rounded-lg"
              />
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
