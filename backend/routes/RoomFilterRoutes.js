import express from "express";
import { getFilterRooms } from "../controller/RoomFilterController.js";

const router = express.Router();

router.get("/search-room", getFilterRooms);

export default router;
