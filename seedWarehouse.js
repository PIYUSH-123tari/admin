const mongoose = require("mongoose");
const Warehouse = require("./model/Warehouse");

// Standard Region schema reference to find Region IDs
const regionSchema = new mongoose.Schema({ region_name: String }, { strict: false });
const Region = mongoose.model("Region", regionSchema);

async function seedWarehouses() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecoloop");
    console.log("Connected to MongoDB");

    // Clear existing warehouses to avoid duplicates if run multiple times
    await Warehouse.deleteMany({});
    console.log("Cleared existing warehouses");

    // Find the regions dynamically
    const northGoa = await Region.findOne({ region_name: "North Goa" });
    const southGoa = await Region.findOne({ region_name: "South Goa" });

    const newWarehouses = [];

    if (northGoa) {
      newWarehouses.push({
        address: "Main Warehouse - North Goa Industrial Estate",
        total_capacity: 5000,
        total_area: 12000,
        region_id: northGoa._id
      });
    } else {
      console.warn("North Goa Region not found in the Region collection.");
    }

    if (southGoa) {
      newWarehouses.push({
        address: "Main Warehouse - South Goa Industrial Estate",
        total_capacity: 4500,
        total_area: 10500,
        region_id: southGoa._id
      });
    } else {
      console.warn("South Goa Region not found in the Region collection.");
    }

    if(newWarehouses.length > 0) {
      await Warehouse.insertMany(newWarehouses);
      console.log(`Successfully imported ${newWarehouses.length} warehouses!`);
    } else {
        console.log("No warehouses were imported because the regions could not be found.");
    }
  } catch (error) {
    console.error("Error importing warehouses:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedWarehouses();
