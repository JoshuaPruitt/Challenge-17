import { Router } from "express";
import { getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, removeFriend} from "../../controllers/userController.js";

const router = Router();

// /api/user
router.route('/').get(getUsers).post(createUser);

// /api/user/:userId
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);

// /api/user/:userId/friends
router.route('/:userId/friends').post(addFriend);

// /api/user/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(removeFriend)

export default router