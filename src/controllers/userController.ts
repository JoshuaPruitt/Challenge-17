import {User, Thought} from '../models/index.js'
import { Request, Response} from 'express';

//Get all the users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err: any){
        res.status(500).json(err);
    }
};

//Get a user based on Id
export const getSingleUser = async(req: Request, res: Response) => {
    try {
        const user = await User.findOne({_id: req.params.userId})
            .select('-__v');
        if(!user){
            return res.status(404).json({message: 'No user with that id found!'});
        }

        res.json(user);
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
};

//Create a new user
export const createUser = async(req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch(err: any){
        res.status(500).json(err);
    }
};

//Update existing user
export const updateUser = async(req: Request, res: Response) => {
    try{ 
        const user = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true},
        );

        if(!user){
            return res.status(404).json({message: 'No user with that id found!'});
        }

        res.json({message: 'User Successfully updated!'});
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
}

//Delete a user and all associated data
export const deleteUser = async(req: Request, res: Response) => {
    try {
        // //find all friends within the about to be deleted user
        // const userF = await User.findOne({_id: req.params.userId});
        // console.log("UserF Friends:", userF?.friends)

        // if(!userF){
        //     return res.status(404).json({message: 'No user with that id can be found!'});
        // }

        // //iterate over the friends and remove the userId from each friend.
        // for(let i = 0; i < userF.friends.length; i++){
        //     console.log("UserF Friend Index:", userF.friends[i])
        //     const friend = User.findOneAndUpdate(
        //         {_id: userF.friends[i]},
        //         {$pull: {friends: req.params.userId}},
        //         {new: true}
        //     )

        //     if(!friend){
        //         return res.status(404).json({message: 'No users with this id exists! Friend not Removed.'});
        //     }
        // }
        const user = await User.findOneAndDelete({_id: req.params.userId});
        
        if(!user){
            return res.status(404).json({message: 'No user with that id can be found!'});
        }

        await Thought.deleteMany({_id: { $in: user.thoughts}});
        res.json({message: 'User and user data have been deleted!'});
        return
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
};

export const addFriend = async(req: Request, res: Response) => {
    try {
        //update user
        const user = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: {friends: req.body.friends}},
            {runValidators: true, new: true},
        )

        if(!user){
            return res.status(404).json({message: 'No user with that id found!'});
        }

        // update added friend or friends
        for(let i=0; i < req.body.friends.length; i++){
            console.log(`Friend: ${req.body.friends[i]}`)
            const friend = await User.findOneAndUpdate(
                {_id: req.body.friends[i]},
                {$set: {friends: req.params.userId}},
                {runValidators: true, new: true},
            )

            if(!friend){
                return res.status(404).json({message: 'No user with that username exists!'});
            }
        }

        res.json({message: 'Friend Successfully added!'});
        return
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
}

export const removeFriend = async(req: Request, res: Response) => {
    try {
        //update user to not have friend linked
        const user = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true},
        );

        if(!user){
            return res.status(404).json({message: 'Friend removed but no user with this id!'});
        }

        const friend = await User.findOneAndUpdate(
            {_id: req.params.friendId},
            {$pull: {friends: req.params.userId}},
            {new: true},
        );

        if(!friend){
            return res.status(404).json({message: 'No user with that username exists!'});
        }
        
        res.json({message: 'Friend successfully removed!'});
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
}