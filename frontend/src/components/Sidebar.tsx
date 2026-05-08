import React from "react";
import {
  Home,
  Folder,
  Tag,
  Star,
  Plus,
  ChevronRight,
  Hash,
  Trash,
  Edit2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import type { Folder as FolderType, Tag as TagType } from "../types/snippet";

interface SidebarProps {
  folders: FolderType[];
  tags: TagType[];
  activeFilter: "all" | "favorites" | "folder" | "tag";
  activeId: string | null;
  onFilterChange: (
    filter: "all" | "favorites" | "folder" | "tag",
    id: string | null,
  ) => void;
  onNewSnippet: () => void;
  onCreateFolder: (name: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  isCreatingFolder: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  tags,
  activeFilter,
  activeId,
  onFilterChange,
  onNewSnippet,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  isCreatingFolder,
}) => {
  const [isAddingFolder, setIsAddingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [editingFolderId, setEditingFolderId] = React.useState<string | null>(
    null,
  );
  const [editFolderName, setEditFolderName] = React.useState("");
  const [showAllTags, setShowAllTags] = React.useState(false);

  const TAG_LIMIT = 10;
  const displayedTags = showAllTags ? tags : tags.slice(0, TAG_LIMIT);

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (editFolderName.trim()) {
      onRenameFolder(id, editFolderName.trim());
      setEditingFolderId(null);
      setEditFolderName("");
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col overflow-hidden border-r border-gray-200 bg-gray-50">
      <div className="p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          SnippetAI
        </h1>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        {/* Main Filters */}
        <nav className="space-y-1">
          <NavItem
            icon={Home}
            label="All Snippets"
            active={activeFilter === "all"}
            onClick={() => onFilterChange("all", null)}
          />
          <NavItem
            icon={Star}
            label="Favorites"
            active={activeFilter === "favorites"}
            onClick={() => onFilterChange("favorites", null)}
          />
        </nav>

        {/* Folders */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Folder className="h-3 w-3" /> Folders
            </h3>
            <button
              onClick={() => setIsAddingFolder(true)}
              className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {isAddingFolder && (
            <form onSubmit={handleFolderSubmit} className="mb-2 px-3">
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => !newFolderName && setIsAddingFolder(false)}
                placeholder="Folder name..."
                className="w-full rounded border border-indigo-300 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isCreatingFolder}
              />
            </form>
          )}

          <div className="space-y-1">
            {folders.length === 0 && !isAddingFolder ? (
              <p className="px-3 text-xs italic text-gray-400">
                No folders created
              </p>
            ) : (
              folders.map((folder) => (
                <div key={folder.id} className="group/folder relative">
                  {editingFolderId === folder.id ? (
                    <div className="flex items-center gap-1 px-3 py-1">
                      <input
                        autoFocus
                        type="text"
                        value={editFolderName}
                        onChange={(e) => setEditFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameSubmit(folder.id);
                          if (e.key === "Escape") setEditingFolderId(null);
                        }}
                        className="w-full rounded border border-indigo-300 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleRenameSubmit(folder.id)}
                        className="p-1 text-indigo-600 hover:text-indigo-700"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setEditingFolderId(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <NavItem
                        icon={ChevronRight}
                        label={folder.name}
                        active={
                          activeFilter === "folder" && activeId === folder.id
                        }
                        onClick={() => onFilterChange("folder", folder.id)}
                        compact
                      />
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover/folder:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(folder.id);
                            setEditFolderName(folder.name);
                          }}
                          className="p-1 text-gray-400 transition-colors hover:text-indigo-600"
                          title="Rename Folder"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Delete folder "${folder.name}"? Snippets will not be deleted.`,
                              )
                            ) {
                              onDeleteFolder(folder.id);
                            }
                          }}
                          className="p-1 text-gray-400 transition-colors hover:text-red-500"
                          title="Delete Folder"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Tag className="h-3 w-3" /> Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-1 px-3">
            {tags.length === 0 ? (
              <p className="text-xs italic text-gray-400">No tags yet</p>
            ) : (
              <>
                {displayedTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => onFilterChange("tag", tag.id)}
                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                      activeFilter === "tag" && activeId === tag.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    <Hash className="h-3 w-3" />
                    {tag.name}
                  </button>
                ))}

                {tags.length > TAG_LIMIT && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="px-2 py-1 text-[10px] font-bold text-indigo-600 transition-colors hover:text-indigo-700"
                  >
                    {showAllTags
                      ? "Show less"
                      : `+${tags.length - TAG_LIMIT} more`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <button
          onClick={onNewSnippet}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Snippet
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  compact,
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-md px-3 transition-colors ${
      compact ? "py-1.5 text-xs" : "py-2 text-sm"
    } font-medium ${
      active
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <Icon
      className={`${compact ? "h-3 w-3" : "h-4 w-4"} ${active ? "text-indigo-600" : "text-gray-400"}`}
    />
    <span className="truncate">{label}</span>
  </button>
);

export default Sidebar;
