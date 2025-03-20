const express = require("express");
const path = require("path");
const { getAllPackages, updatePackage, getCustomerPackages } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard/employee", authMiddleware("employee"), getAllPackages);

router.put("/:id", authMiddleware("employee"), updatePackage);

router.get("/customer", authMiddleware("customer"), getCustomerPackages);


module.exports = router;