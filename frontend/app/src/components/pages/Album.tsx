import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Ellipsis, Folder, FolderPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/input";

const API_HEAD = import.meta.env.VITE_API;

interface Repo {
  repo_id: string;
  repo_name: string;
  owner_email: string;
}

const Album = () => {
  const { userToken, logout } = useAuth();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<any>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${API_HEAD}/api/images/list_repo`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (response.status == 401) {
          logout();
        }
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
  }, [userToken, refresh]);

  const handleOnSelectRepo = (repo_id: string) => {
    navigate(`/photos/${repo_id}`);
  };

  const handleDelete = async (repo_id: string) => {
    const reponse = await fetch(
      `${API_HEAD}/api/images/repo/delete/${repo_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (reponse.ok) {
      alert("Repositories Deleted Successfully!");
      setRefresh((prev: any) => !prev);
    } else {
      setError("Failed Deleting repository!");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target)
    const fe = Object.fromEntries(fd.entries())

    const reponse = await fetch(
        `${API_HEAD}/api/images/repo/add_repo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"repo_name": fe.repo_name})
        }
      );
  
      if (reponse.ok) {
        alert("Repositories Added Successfully!");
        setRefresh((prev: any) => !prev);
      } else {
        setError("Failed Adding repository!");
      }
    
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owned By</TableHead>
          <TableHead>
            <Sheet>
              <SheetTrigger>
                {" "}
                <Button className="flex gap-2">
                  <FolderPlus /> Add Album{" "}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Repository</SheetTitle>
                  <SheetDescription>
                    <form onSubmit={handleSubmit} method="post">
                        <br />
                      <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="text" name="repo_name" placeholder="Enter Class Name" required/>
                        <Button type="submit">Add</Button>
                      </div>
                    </form>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repos.map((repo) => (
          <TableRow key={repo.repo_id}>
            <TableCell>
              <div
                className="flex items-center gap-2 cursor-pointer hover:underline"
                onClick={() => handleOnSelectRepo(repo.repo_id)}
              >
                <Folder className="text-gray-500" />
                {repo.repo_name}
              </div>
            </TableCell>
            <TableCell>{repo.owner_email}</TableCell>
            <TableCell className="text-right">
              <ContextMenu>
                <ContextMenuTrigger>
                  <Ellipsis />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Change Name</ContextMenuItem>
                  <ContextMenuItem
                    className="text-red-400"
                    onClick={() => handleDelete(repo.repo_id)}
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Album;
