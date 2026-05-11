import { useEffect } from "react";
import Layout from "./components/Layout";
import Header from "./components/Header";
import SnippetList from "./components/SnippetList";
import SnippetView from "./components/SnippetView";
import SnippetForm from "./components/SnippetForm";
import AuthContainer from "./components/AuthContainer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorState from "./components/common/ErrorState";
import { useApp } from "./hooks/useApp";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, isLoading: authLoading } = useAuth();

  const { state, handlers } = useApp();
  const {
    selectedSnippet,
    isFormOpen,
    editingSnippet,
    searchQuery,
    isSemanticSearch,
    filteredSnippets,
    currentUser,
    folders,
    tags,
    filterType,
    activeId,
    isLoading: appLoading,
    snippetsError,
    isCreatingFolder,
    page,
    pagination,
  } = state;
  const {
    setSelectedSnippetId,
    setSearchQuery,
    setIsSemanticSearch,
    setFilterType,
    setActiveId,
    handleNewSnippet,
    handleEditSnippet,
    handleFormClose,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    setPage,
  } = handlers;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        if (isFormOpen) return;

        if (selectedSnippet) {
          e.preventDefault();
          setSelectedSnippetId(null);
          // Wait for Header to mount then focus
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("focus-search"));
          }, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSnippet, setSelectedSnippetId, isFormOpen]);

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <AuthContainer />;
  }

  const handleFilterChange = (
    type: "all" | "favorites" | "folder" | "tag",
    id: string | null,
  ) => {
    setFilterType(type);
    setActiveId(id);
    setSelectedSnippetId(null);
    setPage(1);
  };

  const getListTitle = () => {
    if (filterType === "all") return "All Snippets";
    if (filterType === "favorites") return "Favorites";
    if (filterType === "folder" && activeId) {
      return folders?.find((f) => f.id === activeId)?.name || "Folder";
    }
    if (filterType === "tag" && activeId) {
      const tag = tags?.find((t) => t.id === activeId);
      return tag ? `#${tag.name}` : "Tag";
    }
    return "Snippets";
  };

  return (
    <Layout
      onNewSnippet={handleNewSnippet}
      folders={folders || []}
      tags={tags || []}
      activeFilter={filterType}
      activeId={activeId}
      onFilterChange={handleFilterChange}
      onCreateFolder={handleCreateFolder}
      onRenameFolder={handleRenameFolder}
      onDeleteFolder={handleDeleteFolder}
      isCreatingFolder={isCreatingFolder}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {selectedSnippet ? (
          <SnippetView
            snippet={selectedSnippet}
            onBack={() => setSelectedSnippetId(null)}
            onEdit={handleEditSnippet}
            onDelete={() => setSelectedSnippetId(null)}
          />
        ) : (
          <>
            <Header
              user={currentUser}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setPage(1);
              }}
              isSemanticSearch={isSemanticSearch}
              onSemanticToggle={(s) => {
                setIsSemanticSearch(s);
                setPage(1);
              }}
            />

            <div className="flex-1 overflow-y-auto">
              {appLoading ? (
                <LoadingSpinner />
              ) : snippetsError ? (
                <ErrorState
                  title="Connection Error"
                  message="Could not connect to the backend API. Please ensure the server is running."
                />
              ) : (
                <SnippetList
                  snippets={filteredSnippets}
                  title={getListTitle()}
                  onSelectSnippet={(s) => setSelectedSnippetId(s.id)}
                  pagination={pagination}
                  currentPage={page}
                  onPageChange={setPage}
                />
              )}
            </div>
          </>
        )}

        {isFormOpen && (
          <SnippetForm
            snippet={editingSnippet}
            folders={folders || []}
            onClose={handleFormClose}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
