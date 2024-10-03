import {User, Thought} from '../models/index.js'
import {Request, Response} from 'express';

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

        res.json({message: 'Application successfully deleted!'});
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
}

//Delete a user and all associated data
export const deleteUser = async(req: Request, res: Response) => {
    try {
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