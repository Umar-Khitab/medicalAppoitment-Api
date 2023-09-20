const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");


// @desc Get all contacts
// @route GET /api/contacts
// @access private

const getContacts = asyncHandler(async (req, res) => {
    try {
        const contacts = await Contact.find({ created_by: req.user.id });
      

        res.status(200).json(
            {
                contacts: contacts
            });

    } catch (error) {
        // Handle the error and send an error response
        console.log(error);    }
});

// @desc Create Contact
// @route POST /api/contacts
// @access private

const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const contact = await Contact.create({
        name,
        email,
        created_by: req.user.id
    });

    res.status(201).json({ message: "Contact created", contact: contact });
});

// @desc Update Contact contacts
// @route PUT /api/contacts/:id
// @access private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.created_by.toString() !== req.user.id){
        res.status(403);
        throw new Error("User Is not authorized to updated this!");
        return;
    }
    const updateContact = await Contact.findByIdAndUpdate(req.params.id,
        req.body,
        { new: true });

    res.status(200).json({ message: `Contact updated `, contact: updateContact });
});

// @desc Delete contacts
// @route DELETE /api/contacts/:id
// @access private

const deleteContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(404).json({ message: "Contact Not Found" }); // Return a JSON response
            return; // Exit the function to prevent further execution
        }
        if(contact.created_by.toString() !== req.user.id){
            res.status(403);
            throw new Error("User Is not authorized to delete this!");
            return;
        }
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json(deleted);
    } catch (err) {
        console.log(err);
    }
});

// // @desc Get single contact
// // @route GET /api/contacts/:id
// // @access private

const getSingleContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json({ contact });
});

module.exports = {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    getSingleContact
};