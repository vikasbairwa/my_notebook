const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// Rout 1: get all notes get request "/api/notes/fetchallnotes".require login
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(err.message)
        res.status(500).send("some error occured")
    }
})

// Rout 2: add notes using post "/api/notes/addnote".require login
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Enter a valid description").isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote)
    } catch (error) {
        console.log(err.message)
        res.status(500).send("some error occured")
    }
})

// Rout 3: update notes using put "/api/notes/updatenote".require login
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    //create a newnote obj
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // /find the node to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.log(err.message)
        res.status(500).send("some error occured")
    }

})

// Rout 4: delete notes using delete "/api/notes/deletenote".require login
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // /find the node to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Sucess": "note has been deleted", note: note });
    } catch (error) {
        console.log(err.message)
        res.status(500).send("some error occured")
    }

})

module.exports = router