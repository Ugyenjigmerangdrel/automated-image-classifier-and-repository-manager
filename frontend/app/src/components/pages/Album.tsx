import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Ellipsis, Folder } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

const API_HEAD = import.meta.env.VITE_API;

interface Repo {
  repo_id: string;
  repo_name: string;
  owner_email: string;
}

const Album = () => {
  const { userToken } = useAuth();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [userToken]);

  const handleOnSelectRepo = (repo_id: string) => {
    navigate(`/photos/${repo_id}`);
  };

  return (
    <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owned By</TableHead>

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
              <ContextMenuTrigger >
                
              <Ellipsis />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  Change Name
                </ContextMenuItem>
                <ContextMenuItem className="text-red-400">Delete</ContextMenuItem>
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
