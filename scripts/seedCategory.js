const mongoose = require("mongoose");
const Category = require("../models/categoryModel"); // adjust path if needed

const categories = [
    {
        name: "Plumbing",
        subcategories: [
            "Tap Installation",
            "Pipe Leakage Repair",
            "Drain Cleaning",
            "Water Tank Installation",
            "Geyser Installation"
        ]
    },
    {
        name: "Electrical",
        subcategories: [
            "Fan Installation",
            "Wiring Repair",
            "Inverter Installation",
            "Light Fixture Setup",
            "Switchboard Repair"
        ]
    },
    {
        name: "Carpentry",
        subcategories: [
            "Furniture Repair",
            "Door Fitting",
            "Wardrobe Making",
            "Custom Shelving",
            "Wooden Partition Installation"
        ]
    },
    {
        name: "Cleaning",
        subcategories: [
            "Home Deep Cleaning",
            "Kitchen Cleaning",
            "Sofa & Carpet Cleaning",
            "Bathroom Sanitization",
            "Office Cleaning"
        ]
    },
    {
        name: "Painting",
        subcategories: [
            "Interior Painting",
            "Exterior Painting",
            "Texture Painting",
            "Waterproof Coating",
            "Furniture Painting"
        ]
    },
    {
        name: "Home Shifting",
        subcategories: [
            "Local Shifting",
            "Office Relocation",
            "Packing & Unpacking",
            "Loading & Unloading",
            "Furniture Disassembly"
        ]
    },
    {
        name: "Gardening",
        subcategories: [
            "Lawn Maintenance",
            "Plant Installation",
            "Garden Landscaping",
            "Tree Pruning",
            "Pot Arrangement"
        ]
    },
    {
        name: "Laundry",
        subcategories: [
            "Wash & Fold",
            "Ironing",
            "Dry Cleaning",
            "Stain Removal",
            "Bedding Laundry"
        ]
    },
    {
        name: "Decoration",
        subcategories: [
            "Wedding Decoration",
            "Birthday Decoration",
            "Corporate Events",
            "Theme Parties",
            "Stage Decoration"
        ]
    }
];

async function seedCategories() {
    try {
        await mongoose.connect("mongodb+srv://tahir:112233test@auctionplatform.veyca.mongodb.net/EMS_DB", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Category.deleteMany(); // Clear existing data
        await Category.insertMany(categories);

        console.log("✅ Categories seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
}

seedCategories();
