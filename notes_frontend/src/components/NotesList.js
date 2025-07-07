import React, { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

/**
 * PUBLIC_INTERFACE
 * Shows the list of currently visible notes — which reflects filter/search from context.
 */
function NotesList({ onSelect, selectedNoteId }) {
  /** List of user notes, displays all notes and actions, filtered by context (folder/tag/search) */
  const { notes, deleteNote } = useContext(NotesContext);

  return (
    <section className="notes-list">
      <h3 style={{ marginTop: 0 }}>Notes</h3>
      {notes.length === 0 && (
        <div style={{ color: "var(--text-secondary)" }}>
          No notes match your current search or filter.
        </div>
      )}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              marginBottom: "0.7em",
              padding: "0.5em",
              background:
                note.id === selectedNoteId
                  ? "var(--accent)"
                  : "transparent",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 0.2s"
            }}
            onClick={() => onSelect && onSelect(note.id)}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1.08em",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={note.title}
              >
                {note.title}
              </div>
              <div
                style={{
                  fontSize: "0.93em",
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "250px",
                }}
                title={note.content}
              >
                {note.content}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.3em", marginLeft: "1em" }}>
              <button
                aria-label="Edit"
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect && onSelect(note.id); // select for edit
                }}
                style={{
                  padding: "2px 7px",
                  borderRadius: "4px",
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1em",
                }}
              >
                Edit
              </button>
              <button
                aria-label="Delete"
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Confirm and delete
                  if (
                    // eslint-disable-next-line
                    window.confirm("Delete this note?")
                  ) {
                    deleteNote(note.id);
                  }
                }}
                style={{
                  padding: "2px 7px",
                  borderRadius: "4px",
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1em",
                  marginLeft: "0.3em",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NotesList;
