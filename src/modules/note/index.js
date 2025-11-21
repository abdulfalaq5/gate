const NoteHandler = require('./handler')

module.exports = {
  getNotes: NoteHandler.getNotes.bind(NoteHandler),
  getNoteById: NoteHandler.getNoteById.bind(NoteHandler),
  createNote: NoteHandler.createNote.bind(NoteHandler),
  updateNote: NoteHandler.updateNote.bind(NoteHandler),
  deleteNote: NoteHandler.deleteNote.bind(NoteHandler)
}

