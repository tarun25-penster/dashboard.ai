import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import ContentSourceForm from "@/components/forms/ContentSourceForm"; // Import the form component
import { Main } from "@/components/layout/main";

interface DataSource {
  id: number;
  name: string;
  description: string;
}

const initialDataSources: DataSource[] = [
  { id: 1, name: "PDF", description: "Manage PDF Files" },
  { id: 2, name: "Excel", description: "Manage Excel Sheets" },
  { id: 3, name: "Google Sheets", description: "Manage Google Sheets" },
  { id: 4, name: "Reddit", description: "Fetch Reddit Data" },
  { id: 5, name: "API", description: "Manage API Data" },
  { id: 6, name: "RSS Feeds", description: "Manage RSS Feeds" },
];

export default function ContentSource() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DataSource | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [dataSources, setDataSources] = useState(initialDataSources);
  const router = useRouter();

  // Navigate to a specific content source page
  const handleNavigate = (source: DataSource) => {
    router.navigate({ to: `/content_source/${source.name.toLowerCase().replace(/\s+/g, "_")}` });
  };

  // Open edit modal
  const handleEdit = (card: DataSource) => {
    setSelectedCard(card);
    setEditedName(card.name);
    setEditedDescription(card.description);
    setEditOpen(true);
  };

  // Save changes from edit modal
  const handleSave = () => {
    if (selectedCard) {
      setDataSources((prev) =>
        prev.map((item) =>
          item.id === selectedCard.id
            ? { ...item, name: editedName, description: editedDescription }
            : item
        )
      );
    }
    setEditOpen(false);
  };

  return (
    <>
      {/* Header */}
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Page Title & Add Button */}
      <Main>
        <div className="mb-4 flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Content Sources</h2>
            <p className="text-muted-foreground">Manage your content sources here.</p>
          </div>
          <Button onClick={() => setOpen(true)}>Add Source</Button>
        </div>
      </Main>

      {/* Content Source Cards */}
      <div className="p-6 mt-16 grid grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <Card
            key={source.id}
            className="relative p-4 hover:shadow-lg cursor-pointer"
            onClick={() => handleNavigate(source)}
          >
            <CardHeader>
              <CardTitle>{source.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{source.description}</p>
            </CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(source)}>Edit</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        ))}
      </div>

      {/* Add Source Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Source</DialogTitle>
          </DialogHeader>
          <ContentSourceForm  />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedCard?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="Enter new name" />
            <Input value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} placeholder="Enter new description" />
          </div>
          <DialogFooter>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
