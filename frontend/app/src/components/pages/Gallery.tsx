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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const API_HEAD = import.meta.env.VITE_API as string;

interface Photo {
  key: string;
  image_id: number;
  src: string;
  width: number;
  height: number;
  repo_name: string;
}

interface Repo {
  repo_id: string;
  repo_name: string;
  owner_email: string;
}

const Gallery: React.FC = () => {
  const { userToken, logout } = useAuth(); // Assuming Auth Context provides the token
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [repo, setRepos] = useState<Repo[]>([]);
  const [refresh, setRefresh] = useState<any>(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${API_HEAD}/api/images/list`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });


        if (response.status === 401) {
            // alert("Unauthorized");
            logout();
          }
        if (!response.ok) {
          setError("Failed to load images.");
          return;
        }


        const data = await response.json();
        const formattedPhotos: Photo[] = data.image_list.map(
          (photo: any, index: number) => ({
            key: `${photo.image.immage_url}_${index}`,
            image_id: photo.image.image_id,
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

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${API_HEAD}/api/images/list_repo`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch repositories.");
          return;
        }

        const data = await response.json();
        setRepos(data.repo || []);
      } catch (err) {
        setError("Error fetching repositories.");
      }
    };

    fetchRepositories();
    fetchPhotos();
  }, [userToken, refresh]);

  const handleOnClick = (url: string) => {
    alert(`Selected ${url}`);
  };

  const handleDeleteImage = async (image_id: number) => {
    const reponse = await fetch(
      `${API_HEAD}/api/images/delete/${image_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (reponse.ok) {
      alert("Image Deleted Successfully!");
      setRefresh((prev: any) => !prev);
    } else {
      setError("Failed Deleting image!");
    }
  };


  const handleChangeClass = async (value: string) => {
    const new_repo_id = value.split("PHOTO")[0];
    const image_id = value.split("PHOTO")[1];

    try {
      const response = await fetch(`${API_HEAD}/api/images/update_repo`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_repo_id, image_id }),
      });

      if (response.ok) {
        alert("Image Class Changed Successfully successfully!");
        setRefresh((prev: any) => !prev);
      } else {
        setError("Failed to change image class");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {photos.map((photo) => (
          <Sheet key={photo.key}>
            <ContextMenu key={photo.key}>
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
                <ContextMenuItem className="text-red-400" onClick={() => handleDeleteImage(photo.image_id)}>
                  Delete
                </ContextMenuItem>
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
              <br />
              <Select onValueChange={handleChangeClass}>
                <Label>Change Class: </Label>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder={photo.repo_name} />
                </SelectTrigger>
                <SelectContent>
                  {repo.length == 0 && "No Repositories"}
                  {repo.length !== 0 &&
                    repo.map((repo) => (
                      <SelectItem
                        value={`${repo.repo_id}PHOTO${photo.image_id}`}
                      >
                        {repo.repo_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
