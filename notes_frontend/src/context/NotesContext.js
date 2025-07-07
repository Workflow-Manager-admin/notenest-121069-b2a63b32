import React, { createContext, useReducer } from "react";

/**
 * Types/Helpers
 */
const generateId = () => Date.now().toString();

function getDefaultFoldersAndTags(notes) {
  // Derive initial folders/tags from notes array as a fallback for first load/demo
  const allTags = new Set();
  notes.forEach((n) => (n.tags || []).forEach((t) => allTags.add(t)));
  // Always include "Unsorted" default folder
  return {
    folders: [
      { id: "unsorted", name: "Unsorted", color: "#888" },
      { id: "work", name: "Work", color: "#1976d2" },
      { id: "personal", name: "Personal", color: "#43a047" },
    ],
    tags: Array.from(allTags).map((t) => ({ id: t.toLowerCase(), name: t })),
  };
}

/**
 * Initial in-memory state for notes and org structure (mock data for development/demo).
 */
const initialNotesState = {
  notes: [
    {
      id: "1",
      title: "Sample Note 1",
      content: "This is your first note! Edit or delete it.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: "unsorted",
      tags: ["sample"],
    },
    {
      id: "2",
      title: "Sample Note 2",
      content: "Notes are synchronized in your workspace.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: "work",
      tags: [],
    },
  ],
  folders: [
    { id: "unsorted", name: "Unsorted", color: "#888" },
    { id: "work", name: "Work", color: "#1976d2" },
    { id: "personal", name: "Personal", color: "#43a047" },
  ],
  tags: [{ id: "sample", name: "sample" }],
  // Selected org unit for sidebar filtering
  activeFolderId: null,
  activeTagId: null,
};

/**
 * Reducer function for managing note and organization actions.
 */
function notesReducer(state, action) {
  switch (action.type) {
    // Note CRUD
    case "ADD_NOTE": {
      const note = action.payload;
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            ...note,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            folderId: note.folderId || "unsorted",
          },
        ],
      };
    }
    case "EDIT_NOTE": {
      const updated = action.payload;
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === updated.id
            ? {
                ...note,
                ...updated,
                updatedAt: new Date().toISOString(),
              }
            : note
        ),
      };
    }
    case "DELETE_NOTE": {
      const id = action.payload;
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== id),
      };
    }
    // Folder actions
    case "CREATE_FOLDER": {
      const { name, color } = action.payload;
      const id = name.trim().toLowerCase().replace(/[^\w-]/g, "_") + "_" + generateId();
      return {
        ...state,
        folders: [...state.folders, { id, name, color: color || "#888" }],
      };
    }
    case "RENAME_FOLDER": {
      const { id, name } = action.payload;
      return {
        ...state,
        folders: state.folders.map((fldr) =>
          fldr.id === id ? { ...fldr, name } : fldr
        ),
      };
    }
    case "DELETE_FOLDER": {
      const id = action.payload;
      // Move notes in the deleted folder to "Unsorted"
      return {
        ...state,
        folders: state.folders.filter((f) => f.id !== id && f.id !== "unsorted"),
        notes: state.notes.map((note) =>
          note.folderId === id ? { ...note, folderId: "unsorted" } : note
        ),
      };
    }
    // Tag actions
    case "CREATE_TAG": {
      const { name } = action.payload;
      const tagId = name.trim().toLowerCase().replace(/[^\w-]/g, "_");
      if (state.tags.find((t) => t.id === tagId)) return state;
      return {
        ...state,
        tags: [...state.tags, { id: tagId, name }],
      };
    }
    case "RENAME_TAG": {
      const { id, name } = action.payload;
      return {
        ...state,
        tags: state.tags.map((tag) =>
          tag.id === id ? { ...tag, name } : tag
        ),
        notes: state.notes.map((note) => {
          if (!note.tags?.includes(id)) return note;
          return {
            ...note,
            tags: note.tags.map((t) => (t === id ? name.trim().toLowerCase() : t)),
          };
        }),
      };
    }
    case "DELETE_TAG": {
      const id = action.payload;
      return {
        ...state,
        tags: state.tags.filter((t) => t.id !== id),
        notes: state.notes.map((note) => ({
          ...note,
          tags: note.tags.filter((t) => t !== id),
        })),
      };
    }
    // Move note between folders/tags
    case "MOVE_NOTE": {
      const { noteId, folderId, tagId } = action.payload;
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id !== noteId) return note;
          let newNote = { ...note };
          if (folderId) newNote.folderId = folderId;
          if (typeof tagId !== "undefined") {
            // Assign or remove tag
            const tagList = newNote.tags || [];
            if (tagId && !tagList.includes(tagId)) {
              newNote.tags = [...tagList, tagId];
            } else {
              newNote.tags = tagList.filter((t) => t !== tagId);
            }
          }
          return newNote;
        }),
      };
    }
    // Sidebar view filtering
    case "SET_ACTIVE_FOLDER": {
      return { ...state, activeFolderId: action.payload, activeTagId: null };
    }
    case "SET_ACTIVE_TAG": {
      return { ...state, activeFolderId: null, activeTagId: action.payload };
    }
    case "CLEAR_ACTIVE": {
      return { ...state, activeFolderId: null, activeTagId: null };
    }
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * Context for note state & actions across the app.
 */
export const NotesContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Context provider for notes (wraps app to provide global notes state).
 * Provides notes, folders, tags, dispatcher, organization, and CRUD operations.
 */
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialNotesState);

  // Note CRUD
  const addNote = (note) => dispatch({ type: "ADD_NOTE", payload: note });
  const editNote = (note) => dispatch({ type: "EDIT_NOTE", payload: note });
  const deleteNote = (id) => dispatch({ type: "DELETE_NOTE", payload: id });
  // Folders
  const createFolder = ({ name, color }) =>
    dispatch({ type: "CREATE_FOLDER", payload: { name, color } });
  const renameFolder = (id, name) =>
    dispatch({ type: "RENAME_FOLDER", payload: { id, name } });
  const deleteFolder = (id) => dispatch({ type: "DELETE_FOLDER", payload: id });
  // Tags
  const createTag = ({ name }) =>
    dispatch({ type: "CREATE_TAG", payload: { name } });
  const renameTag = (id, name) =>
    dispatch({ type: "RENAME_TAG", payload: { id, name } });
  const deleteTag = (id) => dispatch({ type: "DELETE_TAG", payload: id });
  // Move note (between folders/tags)
  const moveNote = ({ noteId, folderId, tagId }) =>
    dispatch({ type: "MOVE_NOTE", payload: { noteId, folderId, tagId } });
  // Set sidebar filter
  const setActiveFolder = (id) => dispatch({ type: "SET_ACTIVE_FOLDER", payload: id });
  const setActiveTag = (id) => dispatch({ type: "SET_ACTIVE_TAG", payload: id });
  const clearActive = () => dispatch({ type: "CLEAR_ACTIVE" });

  // Filtered notes by selected folder or tag
  let visibleNotes = state.notes;
  if (state.activeFolderId) {
    visibleNotes = visibleNotes.filter((note) => note.folderId === state.activeFolderId);
  } else if (state.activeTagId) {
    visibleNotes = visibleNotes.filter((note) => (note.tags || []).includes(state.activeTagId));
  }

  return (
    <NotesContext.Provider
      value={{
        notes: visibleNotes,
        allNotes: state.notes,
        folders: state.folders,
        tags: state.tags,
        activeFolderId: state.activeFolderId,
        activeTagId: state.activeTagId,
        addNote,
        editNote,
        deleteNote,
        createFolder,
        renameFolder,
        deleteFolder,
        createTag,
        renameTag,
        deleteTag,
        moveNote,
        setActiveFolder,
        setActiveTag,
        clearActive,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
