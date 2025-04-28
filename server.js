// server.js
require("dotenv").config(); // ← make sure this is first
const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

// —————————————————————————————————————————————
// 1) Connect to MongoDB using your MONGO_URI
// —————————————————————————————————————————————
mongoose
    .connect(process.env.MONGO_URI, {
        // these options are defaults in newer drivers
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then(() => console.log("🗄️  Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// —————————————————————————————————————————————
// 2) Middleware
// —————————————————————————————————————————————
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// —————————————————————————————————————————————
// 3) Multer for deck-image uploads
// —————————————————————————————————————————————
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, path.join(__dirname, "public/uploads")),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = multer({ storage });

// —————————————————————————————————————————————
// 4) Mongoose Card schema & model
// —————————————————————————————————————————————
const mongooseCardSchema = new mongoose.Schema({
    id: String,
    img: String,
    name: String,
    cost: String,
    attack: String,
    health: String,
    text: String,
});
const Card = mongoose.model("Card", mongooseCardSchema);

// —————————————————————————————————————————————
// 5) In-memory decks + Joi schemas
// —————————————————————————————————————————————
const decks = [];
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

// —————————————————————————————————————————————
// 6) Routes
// —————————————————————————————————————————————

// GET /api/cards
app.get("/api/cards", async (req, res) => {
    try {
        const cards = await Card.find();
        return res.json(cards);
    } catch (err) {
        console.error("Error fetching cards from Mongo:", err);
        // fallback: return [] or a static array if you want
        return res
            .status(500)
            .json({ success: false, message: "Could not load cards" });
    }
});

// GET /api/decks
app.get("/api/decks", (req, res) => {
    res.json(decks);
});

// POST /api/decks
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

// PUT /api/decks/:id
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

// POST /api/decks/:id/cards
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

// DELETE /api/decks/:id
app.delete("/api/decks/:id", (req, res) => {
    const idx = decks.findIndex((d) => d.id === req.params.id);
    if (idx === -1)
        return res
            .status(404)
            .json({ success: false, message: "Deck not found" });
    decks.splice(idx, 1);
    res.json({ success: true });
});

// —————————————————————————————————————————————
// 7) Start
// —————————————————————————————————————————————
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
