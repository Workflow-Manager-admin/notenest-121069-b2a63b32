import React, { useContext, useState, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import NotesList from "./NotesList";

// PUBLIC_INTERFACE
function NoteEditor() {
  /**
   * Editor for creating or editing a note.
   * Handles selection, new note, edit, cancel, and updates via context.
   */
  const { notes, addNote, editNote } = useContext(NotesContext);
  // The id of the selected note for editing ("new" means new note)
  const [selectedId, setSelectedId] = useState("new");
  // Local form state
  const [form, setForm] = useState(noteFormFields(""));

  // Update form when active note changes
  useEffect(() => {
    if (selectedId === "new") {
      setForm(noteFormFields(""));
    } else {
      const found = notes.find((n) => n.id === selectedId);
      if (found) setForm(noteFormFields(found));
    }
  }, [selectedId, notes]);

  function noteFormFields(initial) {
    if (!initial || typeof initial === "string") {
      return { title: "", content: "", tags: "" };
    }
    // Convert array tags to csv for edit form
    return {
      title: initial.title || "",
      content: initial.content || "",
      tags: (initial.tags || []).join(", "),
    };
  }

  // Handle input change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle Save
  function handleSave(e) {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    const trimmedContent = form.content.trim();
    if (!trimmedTitle) return; // Require title
    const tagsArr = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (selectedId === "new") {
      addNote({ title: trimmedTitle, content: trimmedContent, tags: tagsArr });
      setSelectedId("new");
      setForm(noteFormFields(""));
    } else {
      editNote({
        id: selectedId,
        title: trimmedTitle,
        content: trimmedContent,
        tags: tagsArr,
      });
    }
  }

  // Handle Cancel Edit/New
  function handleCancel() {
    setSelectedId("new");
    setForm(noteFormFields(""));
  }

  // Active note for edit mode
  const isEditing = selectedId !== "new";
  const selectedNoteObj =
    isEditing && notes.find((n) => n.id === selectedId);

  return (
    <>
      <NotesList onSelect={setSelectedId} selectedNoteId={selectedId} />
      <section className="note-editor">
        <h3 style={{ marginTop: 0 }}>
          {isEditing ? "Edit Note" : "Create a New Note"}
        </h3>
        <form onSubmit={handleSave} autoComplete="off">
          <div style={{ marginBottom: "0.6em" }}>
            <label htmlFor="noteTitle" style={{ fontWeight: 500 }}>
              Title
            </label>
            <input
              type="text"
              id="noteTitle"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter note title"
              style={{
                width: "100%",
                padding: "0.5em 0.6em",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                fontSize: "1em",
                boxSizing: "border-box",
                marginTop: "0.1em",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "0.6em" }}>
            <label htmlFor="noteContent" style={{ fontWeight: 500 }}>
              Content
            </label>
            <textarea
              id="noteContent"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your note here..."
              rows={6}
              style={{
                width: "100%",
                padding: "0.5em 0.6em",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                fontSize: "1em",
                boxSizing: "border-box",
                marginTop: "0.1em",
                fontFamily: "inherit"
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "1em" }}>
            <label htmlFor="noteTags" style={{ fontWeight: 500 }}>
              Tags
            </label>
            <input
              type="text"
              id="noteTags"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Comma-separated tags"
              style={{
                width: "100%",
                padding: "0.5em 0.6em",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                fontSize: "1em",
                boxSizing: "border-box",
                marginTop: "0.1em",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.7em" }}>
            <button
              type="submit"
              className="btn btn-large"
              style={{
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "6px",
                padding: "0.7em 1.5em",
                fontSize: "1em",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isEditing ? "Save" : "Create"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
              style={{
                background: "#bbb",
                color: "#444",
                border: "none",
                borderRadius: "6px",
                padding: "0.7em 1.5em",
                fontWeight: 600,
                fontSize: "1em",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
          {isEditing && (
            <div style={{ fontSize: "0.98em", color: "var(--text-secondary)", marginTop: "0.6em" }}>
              Last edited:{" "}
              {new Date(selectedNoteObj?.updatedAt).toLocaleString()}
            </div>
          )}
        </form>
      </section>
    </>
  );
}

export default NoteEditor;
