const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ---------------- ROUTES ---------------- //

// Index + Create
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),

        (req, res, next) => {
            if (req.file) {
                req.body.listing.image = {
                    url: req.file.path,
                    filename: req.file.filename
                };
            }
            next();
        },

        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Form
router.get(
    "/new",
    isLoggedIn,
    wrapAsync(listingController.renderNewForm)
);

// Show + Update + Delete
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),

        (req, res, next) => {
            if (req.file) {
                req.body.listing.image = {
                    url: req.file.path,
                    filename: req.file.filename
                };
            }
            next();
        },

        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );

// Edit Form
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;