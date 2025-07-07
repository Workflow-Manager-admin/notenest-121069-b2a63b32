import React, { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";

// PUBLIC_INTERFACE
function Sidebar({ isOpen, onClose }) {
  /**
   * Sidebar navigation with Folders, Tags CRUD, note moving, organization & filtering.
   */

  const {
    folders,
    tags,
    activeFolderId,
    activeTagId,
    setActiveFolder,
    setActiveTag,
    clearActive,
    createFolder,
    renameFolder,
    deleteFolder,
    createTag,
    renameTag,
    deleteTag,
    notes,
    allNotes,
    moveNote,
  } = useContext(NotesContext);

  // UI states
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showRenameFolder, setShowRenameFolder] = useState(null); // folderId or null
  const [renameFolderName, setRenameFolderName] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [showRenameTag, setShowRenameTag] = useState(null); // tagId or null
  const [renameTagName, setRenameTagName] = useState("");
  const [moveNoteId, setMoveNoteId] = useState(null);
  const [moveToFolderId, setMoveToFolderId] = useState("");
  const [moveToTagId, setMoveToTagId] = useState("");
  const [confirmDeleteFolderId, setConfirmDeleteFolderId] = useState(null);
  const [confirmDeleteTagId, setConfirmDeleteTagId] = useState(null);

  // Event Handlers

  // Folders
  function handleAddFolder() {
    if (!newFolderName.trim()) return;
    createFolder({ name: newFolderName.trim() });
    setNewFolderName("");
    setShowNewFolder(false);
  }
  function handleRenameFolder(folderId) {
    if (!renameFolderName.trim()) return;
    renameFolder(folderId, renameFolderName.trim());
    setShowRenameFolder(null);
    setRenameFolderName("");
  }
  function handleDeleteFolder(folderId) {
    deleteFolder(folderId);
    setConfirmDeleteFolderId(null);
    // If current filter was this, clear
    if (activeFolderId === folderId) clearActive();
  }

  // Tags
  function handleAddTag() {
    if (!newTagName.trim()) return;
    createTag({ name: newTagName.trim() });
    setNewTagName("");
    setShowNewTag(false);
  }
  function handleRenameTag(tagId) {
    if (!renameTagName.trim()) return;
    renameTag(tagId, renameTagName.trim());
    setShowRenameTag(null);
    setRenameTagName("");
  }
  function handleDeleteTag(tagId) {
    deleteTag(tagId);
    setConfirmDeleteTagId(null);
    if (activeTagId === tagId) clearActive();
  }

  // Move Note
  function handlePrepareMove(noteId) {
    setMoveNoteId(noteId);
    setMoveToFolderId("");
    setMoveToTagId("");
  }
  function handleMoveNoteSubmit(e) {
    e.preventDefault();
    if (!moveNoteId || (!moveToFolderId && !moveToTagId)) return;
    moveNote({ noteId: moveNoteId, folderId: moveToFolderId, tagId: moveToTagId });
    setMoveNoteId(null);
    setMoveToFolderId("");
    setMoveToTagId("");
  }

  // Sidebar content rendering

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      <div style={{ fontWeight: 700, fontSize: "1.18em", letterSpacing: "0.5px", marginBottom: "1.1em", paddingLeft: "1em" }}>
        Organization
      </div>
      {/* Folders */}
      <div style={{ paddingLeft: "1em", marginBottom: "1.2em" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }}>
          <span style={{ fontWeight: 600, letterSpacing: "0.3px" }}>Folders</span>
          <button
            style={{
              marginLeft: "auto",
              padding: "2px 9px",
              borderRadius: "6px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.97em",
            }}
            aria-label="Create new folder"
            onClick={() => setShowNewFolder((v) => !v)}
          >
            +
          </button>
        </div>
        {/* New Folder Form */}
        {showNewFolder && (
          <div style={{ marginBottom: "0.4em" }}>
            <input
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              style={{
                width: "80%",
                padding: "4px 9px",
                borderRadius: "5px",
                border: "1px solid #bbb",
                marginRight: "4px"
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddFolder(); }}
            />
            <button
              onClick={handleAddFolder}
              style={{
                border: "none",
                background: "#43a047",
                color: "#fff",
                borderRadius: "5px",
                padding: "3px 11px",
                fontWeight: 600,
                fontSize: "0.95em"
              }}
            >Add</button>
            <button
              onClick={() => setShowNewFolder(false)}
              style={{
                marginLeft: "4px",
                background: "none",
                border: "none",
                color: "#b71c1c",
                fontWeight: 700,
                cursor: "pointer"
              }}
              aria-label="Cancel new folder"
            >X</button>
          </div>
        )}
        <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
          {folders.map((folder) => (
            <li
              key={folder.id}
              style={{
                background: activeFolderId === folder.id ? "var(--accent)" : "transparent",
                color: activeFolderId === folder.id ? "#222" : "#fff",
                borderRadius: "6px",
                padding: "4px 7px",
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "1em",
                transition: "background 0.14s"
              }}
              onClick={() => { setActiveFolder(folder.id); onClose && onClose();}}
              tabIndex={0}
              aria-label={`View notes in folder ${folder.name}`}
            >
              <span>
                <span style={{
                  display: "inline-block",
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: folder.color || "#888",
                  marginRight: 9,
                  verticalAlign: "middle"
                }} />{" "}
                {showRenameFolder !== folder.id ? folder.name :
                  <input
                    type="text"
                    value={renameFolderName}
                    autoFocus
                    onChange={e => setRenameFolderName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(folder.id); }}
                    style={{
                      width: "81px",
                      borderRadius: 4,
                      fontSize: "0.99em",
                      padding: "2px 7px",
                      marginLeft: 2
                    }}
                  />
                }
              </span>
              {/* Folder Actions */}
              {folder.id !== "unsorted" && (
                <span style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                  {showRenameFolder === folder.id ?
                    <>
                      <button
                        aria-label="Save folder rename"
                        style={{
                          color: "#388e3c",
                          border: "none", background: "none", cursor: "pointer",
                          fontWeight: 800, fontSize: "1em"
                        }}
                        onClick={e => { e.stopPropagation(); handleRenameFolder(folder.id); }}
                      >✔</button>
                      <button
                        aria-label="Cancel rename"
                        style={{
                          color: "#b71c1c", border: "none", background: "none", fontWeight: 700, fontSize: "1em", cursor: "pointer"
                        }}
                        onClick={e => { e.stopPropagation(); setShowRenameFolder(null); setRenameFolderName(""); }}
                      >X</button>
                    </>
                    :
                    <>
                      <button
                        aria-label="Rename folder"
                        style={{
                          color: "#ffe178", border: "none", background: "none", fontWeight: 700, cursor: "pointer"
                        }}
                        onClick={e => { e.stopPropagation(); setShowRenameFolder(folder.id); setRenameFolderName(folder.name); }}
                      >✎</button>
                      <button
                        aria-label="Delete folder"
                        style={{ color: "#ff5e57", border: "none", background: "none", fontWeight: 700, cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); setConfirmDeleteFolderId(folder.id); }}
                      >🗑</button>
                    </>
                  }
                </span>
              )}
            </li>
          ))}
        </ul>
        {/* Folder delete confirmation */}
        {confirmDeleteFolderId && (
          <div style={{
            background: "#fff7ee", color: "#c62828", borderRadius: 5,
            border: "1px solid #e57373", padding: 10, margin: "4px 0"
          }}>
            <div>Delete this folder?</div>
            <button style={{ marginRight: 5, color: "#c62828", fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}
              onClick={() => handleDeleteFolder(confirmDeleteFolderId)}
            >Delete</button>
            <button style={{ color: "#222", border: "none", background: "none", marginLeft: 2, fontWeight: 700, cursor: "pointer" }}
              onClick={() => setConfirmDeleteFolderId(null)}
            >Cancel</button>
          </div>
        )}
      </div>
      {/* Tags */}
      <div style={{ paddingLeft: "1em", marginBottom: "1.2em" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }}>
          <span style={{ fontWeight: 600, letterSpacing: "0.3px" }}>Tags</span>
          <button
            style={{
              marginLeft: "auto",
              padding: "2px 9px",
              borderRadius: "6px",
              background: "#fbc02d",
              color: "#222",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.97em"
            }}
            aria-label="Create new tag"
            onClick={() => setShowNewTag((v) => !v)}
          >
            +
          </button>
        </div>
        {/* New Tag Form */}
        {showNewTag && (
          <div style={{ marginBottom: "0.4em" }}>
            <input
              type="text"
              placeholder="Tag name..."
              value={newTagName}
              autoFocus
              onChange={(e) => setNewTagName(e.target.value)}
              style={{
                width: "65%",
                padding: "4px 9px",
                borderRadius: "5px",
                border: "1px solid #bbb",
                marginRight: "4px"
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddTag(); }}
            />
            <button
              onClick={handleAddTag}
              style={{
                border: "none",
                background: "#968520",
                color: "#fff",
                borderRadius: "5px",
                padding: "3px 9px",
                fontWeight: 600,
                fontSize: "0.95em"
              }}
            >Add</button>
            <button
              onClick={() => setShowNewTag(false)}
              style={{
                marginLeft: "4px",
                background: "none",
                border: "none",
                color: "#b71c1c",
                fontWeight: 700,
                cursor: "pointer"
              }}
              aria-label="Cancel new tag"
            >X</button>
          </div>
        )}
        <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
          {tags.map((tag) => (
            <li
              key={tag.id}
              style={{
                background: activeTagId === tag.id ? "var(--accent)" : "transparent",
                color: activeTagId === tag.id ? "#222" : "#fff",
                borderRadius: "6px",
                padding: "4px 7px",
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "1em",
                transition: "background 0.14s"
              }}
              onClick={() => { setActiveTag(tag.id); onClose && onClose(); }}
              tabIndex={0}
              aria-label={`View notes with tag ${tag.name}`}
            >
              <span>
                #{showRenameTag !== tag.id ? tag.name :
                  <input
                    type="text"
                    value={renameTagName}
                    autoFocus
                    onChange={e => setRenameTagName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameTag(tag.id); }}
                    style={{
                      width: "71px",
                      borderRadius: 4,
                      fontSize: "0.99em",
                      padding: "2px 7px",
                      marginLeft: 2
                    }}
                  />
                }
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                {showRenameTag === tag.id ?
                  <>
                    <button
                      aria-label="Save tag rename"
                      style={{
                        color: "#388e3c",
                        border: "none", background: "none", cursor: "pointer",
                        fontWeight: 800, fontSize: "1em"
                      }}
                      onClick={e => { e.stopPropagation(); handleRenameTag(tag.id); }}
                    >✔</button>
                    <button
                      aria-label="Cancel rename"
                      style={{
                        color: "#b71c1c", border: "none", background: "none", fontWeight: 700, fontSize: "1em", cursor: "pointer"
                      }}
                      onClick={e => { e.stopPropagation(); setShowRenameTag(null); setRenameTagName(""); }}
                    >X</button>
                  </>
                  :
                  <>
                    <button
                      aria-label="Rename tag"
                      style={{
                        color: "#ffe178", border: "none", background: "none", fontWeight: 700, cursor: "pointer"
                      }}
                      onClick={e => { e.stopPropagation(); setShowRenameTag(tag.id); setRenameTagName(tag.name); }}
                    >✎</button>
                    <button
                      aria-label="Delete tag"
                      style={{ color: "#ff5e57", border: "none", background: "none", fontWeight: 700, cursor: "pointer" }}
                      onClick={e => { e.stopPropagation(); setConfirmDeleteTagId(tag.id); }}
                    >🗑</button>
                  </>
                }
              </span>
            </li>
          ))}
        </ul>
        {/* Tag delete confirmation */}
        {confirmDeleteTagId && (
          <div style={{
            background: "#fff7ee", color: "#c62828", borderRadius: 5,
            border: "1px solid #e57373", padding: 10, margin: "4px 0"
          }}>
            <div>Delete this tag?</div>
            <button style={{ marginRight: 5, color: "#c62828", fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}
              onClick={() => handleDeleteTag(confirmDeleteTagId)}
            >Delete</button>
            <button style={{ color: "#222", border: "none", background: "none", marginLeft: 2, fontWeight: 700, cursor: "pointer" }}
              onClick={() => setConfirmDeleteTagId(null)}
            >Cancel</button>
          </div>
        )}
      </div>
      {/* Move Notes */}
      <div style={{
        paddingLeft: "1em",
        marginBottom: "1.2em",
      }}>
        <div style={{ fontWeight: 600, marginBottom: 7 }}>
          Move Note
        </div>
        <form onSubmit={handleMoveNoteSubmit} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 3 }}>
          <select
            required
            aria-label="Select note to move"
            value={moveNoteId || ""}
            onChange={e => setMoveNoteId(e.target.value)}
            style={{ borderRadius: 4, padding: "3px 5px" }}
          >
            <option value="">-- choose note --</option>
            {allNotes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title.length > 16 ? note.title.slice(0, 16) + "…" : note.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Move to folder"
            value={moveToFolderId}
            onChange={e => setMoveToFolderId(e.target.value)}
            style={{ borderRadius: 4, padding: "3px 5px" }}
          >
            <option value="">-- folder --</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <select
            aria-label="Add to tag"
            value={moveToTagId}
            onChange={e => setMoveToTagId(e.target.value)}
            style={{ borderRadius: 4, padding: "3px 5px" }}
          >
            <option value="">-- tag --</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div style={{ marginTop: 2 }}>
            <button
              type="submit"
              style={{
                background: "#43a047",
                color: "#fff",
                borderRadius: "5px",
                fontWeight: 600,
                border: "none",
                padding: "2px 11px",
                cursor: "pointer"
              }}
              disabled={!moveNoteId || (!moveToFolderId && !moveToTagId)}
            >Move</button>
            <button
              type="button"
              style={{
                marginLeft: 6,
                background: "none",
                border: "none",
                color: "#b71c1c",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => { setMoveNoteId(null); setMoveToFolderId(""); setMoveToTagId(""); }}
            >Cancel</button>
          </div>
        </form>
      </div>
      {/* Filter reset */}
      <div style={{ marginTop: "2.2em", textAlign: "center" }}>
        <button
          onClick={() => { clearActive(); onClose && onClose(); }}
          style={{
            background: "#eee",
            color: "#111",
            border: "1px solid #bbb",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.98em",
            padding: "2px 12px",
            cursor: "pointer"
          }}
          aria-label="Show all notes"
        >Show All Notes</button>
      </div>
    </aside>
  );
}

export default Sidebar;
