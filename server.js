const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

mongoose
    .connect(
        "mongodb+srv://admin:12i9U3kgJbOL8kyl@cluster0.fxawkan.mongodb.net/",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Multer setup for deck image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public/uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = multer({ storage });

// In-memory decks store
const decks = [];

// Joi schemas
const deckSchema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
});
const cardSchema = Joi.object({
    id: Joi.string().required(),
    img: Joi.string().required(),
    name: Joi.string().required(),
    cost: Joi.string().required(),
    attack: Joi.string().required(),
    health: Joi.string().required(),
    text: Joi.string().required(),
});

// Mongoose Card model
const mongooseCardSchema = new mongoose.Schema(
    {
        img: String,
        name: String,
        cost: String,
        attack: String,
        health: String,
        text: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
mongooseCardSchema.virtual("id").get(function () {
    return this._id.toString();
});
const Card = mongoose.model("Card", mongooseCardSchema);

// GET all cards (from Mongo)
app.get("/api/cards", async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET all decks (in-memory)
app.get("/api/decks", (req, res) => {
    res.json(decks);
});

// POST create a new deck
app.post("/api/decks", upload.single("image"), (req, res) => {
    const { error, value } = deckSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });

    const id = String(decks.length + 1);
    const newDeck = {
        id,
        name: value.name,
        description: value.description,
        cards: [],
    };
    if (req.file) newDeck.image = `/uploads/${req.file.filename}`;
    decks.push(newDeck);
    res.status(201).json({ success: true, deck: newDeck });
});

// PUT update an existing deck
app.put("/api/decks/:id", upload.single("image"), (req, res) => {
    const idx = decks.findIndex((d) => d.id === req.params.id);
    if (idx === -1)
        return res
            .status(404)
            .json({ success: false, message: "Deck not found" });

    const { error, value } = deckSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });

    decks[idx].name = value.name;
    decks[idx].description = value.description;
    if (req.file) decks[idx].image = `/uploads/${req.file.filename}`;

    res.json({ success: true, deck: decks[idx] });
});

// POST add a card to a deck
app.post("/api/decks/:id/cards", (req, res) => {
    const deck = decks.find((d) => d.id === req.params.id);
    if (!deck)
        return res
            .status(404)
            .json({ success: false, message: "Deck not found" });

    const { error, value } = cardSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });

    deck.cards.push(value);
    res.json({ success: true, deck });
});

// DELETE a deck
app.delete("/api/decks/:id", (req, res) => {
    const idx = decks.findIndex((d) => d.id === req.params.id);
    if (idx === -1)
        return res
            .status(404)
            .json({ success: false, message: "Deck not found" });

    decks.splice(idx, 1);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
