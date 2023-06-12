const router = require("express").Router();
const {airline} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const role = require("../middlewares/role");

router.get("/", airline.getAll);
router.get("/:id", airline.getDetail);
router.post("/", jwt.authenticate, role.hasRole(["ADMIN"]), airline.create);
router.put("/:id", jwt.authenticate, role.hasRole(["ADMIN"]), airline.update);
router.delete("/:id", jwt.authenticate, role.hasRole(["ADMIN"]), airline.delete);

module.exports = router;