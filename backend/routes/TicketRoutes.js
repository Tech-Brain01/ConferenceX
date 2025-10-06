import express from "express";
import {
  createTicketController,
  getUserTicketController,
  getAllTicketsController,
  getTicketDetailsController,
  addMessageController, 
  updateTicketStatusController
} from "../controller/TicketController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

//user create ticket
router.post("/create", authenticateJWT, createTicketController);

// user see created ticket
router.get("/my", authenticateJWT, getUserTicketController);

// admin see all the tickets
router.get("/all", authenticateJWT, isAdmin, getAllTicketsController);

//get ticket details
router.get("/:ticketId" , authenticateJWT , getTicketDetailsController);

//add reply message
router.post("/message", authenticateJWT , addMessageController);

// update ticket status - admin only
router.put("/:ticketId/status", authenticateJWT, isAdmin, updateTicketStatusController);



export default router;
