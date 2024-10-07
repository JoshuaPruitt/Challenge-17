import { Thought, User } from "../models/index.js";
import { Request, Response } from "express";

//Get all thoughts
export const getThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch(err: any){
        res.status(500).json(err);
    }
};

//Get a single thought by id
export const getSingleThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({_id: req.params.thoughtId});

        if(!thought){
            return res.status(404).json({message: 'No thought with that Id found!'});
        }

        res.json(thought);
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
};

//Create Thought
export const createThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.create(req.body);

        if(!thought){
            return res.status(404).json({message: 'Thought unable to be created!'});
        }

        const user = await User.findOneAndUpdate(
            {username: req.body.username},
            {$addToSet: {thoughts: thought._id}},
            {runValidators: true, new: true},
        );

        if(!user){
            return res.status(404).json({message: 'Thought unable to be added to user!'});
        }

        res.json(thought);
        return;
    } catch(err: any){
        console.log(err);
        res.status(500).json(err);
        return;
    }
}

//update thought
export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true},
        );

        if(!thought){
            return res.status(404).json({message: 'No thought found with id!'})
        }

        res.json(thought);
        return;
    } catch(err: any){
        console.log(err);
        res.status(500).json(err);
        return;
    }
};

//delete thought
export const deleteThought = async(req: Request, res: Response) => {
    try{
        const thought = await Thought.findOneAndDelete({_id: req.params.thoughtId});
        
        if(!thought){
            return res.status(404).json({message: 'No thought with this id found!'});
        }

        //update user to not have thought linked
        const user = await User.findOneAndUpdate(
            {thoughts: req.params.thoughtId},
            {$pull: {thoughts: req.params.thoughtId}},
            {new: true},
        );

        if(!user){
            return res.status(404).json({message: 'Thought deleted but no user with this id!'});
        }

        res.json({message: 'Thought successfully deleted!'});
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    };
};

export const addReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true},
        );

        if(!thought){
            return res.status(404).json({message: 'No thought with this id exists!'});
        }

        const user = await User.findOneAndUpdate(
            {username: req.body.username},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true},
        );

        if(!user){
            return res.status(404).json({message: 'No user with this username exists!'});
        }

        res.json(thought);
        return;
    } catch(err: any){
        res.status(500).json(err);
        return;
    }
};

export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true},
        );

        if(!thought){
            return res.status(404).json({message: 'Unable to delete reaction, No thought with this id!'});
        }

        const user = await User.findOneAndUpdate(
            {thoughts: req.params.thoughtId},
            {$pull: {thoughts: req.params.thoughtId}},
            {runValidators: true, new: true},
        )

        if(!user){
            return res.status(404).json({message: 'Unable to find user attached to this thought!'});
        }

        res.json(thought);
        return;
    } catch(err){
        res.status(500).json(err);
        return;
    }
};

