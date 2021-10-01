import React from 'react'
import NoteContext from './NoteContext'
import { useState } from 'react'

const NoteState= (props)=>{
  const host = "http://localhost:5000"
    const initialNote = []

      const [notes, setNotes] = useState(initialNote)

      //get all note
      const getNote=async ()=>{
        //api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
        const json = await response.json();

          setNotes(json);
      }

      //add note
      const addNote=async (title, description, tag)=>{
        //api call
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}) 
        });
        const note = await response.json();
          setNotes(notes.concat(note));
      }
      // delete note
      const deleteNote=async (id)=>{
        //api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          // body: JSON.stringify({title, description, tag}) 
        });
         const json = await response.json();
        const newNotes = notes.filter((note)=>{return note._id !== id})
        setNotes(newNotes);
      }

      // edit note
      
    const editNote= async (id, title, description, tag)=>{
      //api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}) 
        });
        const json = await response.json();
    
        let newNote = JSON.parse(JSON.stringify(notes))
          for (let index = 0; index < newNote.length; index++) {
            const element = newNote[index];
            if(element._id=== id){
              newNote[index].title = title;
              newNote[index].description = description;
              newNote[index].tag = tag;
              break;
            }
            
          }
          setNotes(newNote);
      }

    return(
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNote}}>
           {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;