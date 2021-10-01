import React from 'react'
import NoteContext from "../context/notes/NoteContext"
import { useContext } from 'react';

function NoteItem(props) {
    const context = useContext(NoteContext)
    const {deleteNote} = context;
    const { note, updateNote } = props;
    return (
        <div className="col-md-3 my-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                    <h5 className="card-title">{note.title}</h5>
                    <i className="fas fa-trash mx-3" onClick={()=>{deleteNote(note._id);
                     props.showAlert("deleted successful","success")}}></i>
                    <i className="fas fa-edit" onClick={()=>{updateNote(note)}}></i>
                    </div>
                    <h6 className="card-subtitle mb-2 text-muted">{note.tag}</h6>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>

        </div>
    )
}

export default NoteItem
