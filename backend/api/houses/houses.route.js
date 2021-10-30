import express from "express";
import HousesCtrl from "./houses.controller.js";

const router = express.Router();

router
  .route("/")
  .get(HousesCtrl.apiGetHouse)
  .post(HousesCtrl.apiCreateHouse)
  .delete(HousesCtrl.apiDeleteHouse);

router.route("/members").put(HousesCtrl.apiUpdateMembers);
router.route("/chores").put(HousesCtrl.apiUpdateChores);
router.route("/triggerSchedule").put(HousesCtrl.apiTriggerSchedule);
router.route("/expenses").put(HousesCtrl.apiUpdateExpenses);

export default router;
