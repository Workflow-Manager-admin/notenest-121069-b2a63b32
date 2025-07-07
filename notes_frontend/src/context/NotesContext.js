import React, { createContext, useReducer } from "react";

/**
 * Initial in-memory state for notes (mock data for development/demo).
 */
const initialNotesState = {
  notes: [
    {
      id: "1",
      title: "Sample Note 1",
      content: "This is your first note! Edit or delete it.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["sample"],
    },
    {
      id: "2",
      title: "Sample Note 2",
      content: "Notes are synchronized in your workspace.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    },
  ],
};

/**
 * Reducer function for managing note actions.
 */
function notesReducer(state, action) {
  switch (action.type) {
    // Add a new note
    case "ADD_NOTE": {
      const note = action.payload;
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            ...note,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    }
    // Edit an existing note
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
    // Delete a note
    case "DELETE_NOTE": {
      const id = action.payload;
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== id),
      };
    }
    // Organize notes (e.g., tags/folders)
    case "ORGANIZE_NOTE":
      // Placeholder: Organize implementation
      return { ...state };
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
 * Provides notes, dispatcher, and CRUD operation placeholders.
 */
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialNotesState);

  // Placeholder handlers for future CRUD/organize methods
  const addNote = (note) => dispatch({ type: "ADD_NOTE", payload: note });
  const editNote = (note) => dispatch({ type: "EDIT_NOTE", payload: note });
  const deleteNote = (id) => dispatch({ type: "DELETE_NOTE", payload: id });
  const organizeNote = (info) => dispatch({ type: "ORGANIZE_NOTE", payload: info });

  return (
    <NotesContext.Provider
      value={{
        notes: state.notes,
        addNote,
        editNote,
        deleteNote,
        organizeNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
