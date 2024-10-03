import { Router } from "express";
import { getUsers, getSingleUser, createUser, updateUser, deleteUser } from "../../controllers/userController.js";

const router = Router();

// /api/user
router.route('/').get(getUsers).post(createUser);

// /api/user/:userId
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);

export default router