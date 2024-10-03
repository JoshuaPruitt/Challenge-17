import { Thought, User } from "../models";
import { application, Request, Response } from "express";

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

        res.json(application);
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
        const user = await Thought.findOneAndUpdate(
            {_id: req.body.userId},
            {$addToSet: {thoughts: thought._id}},
            {new: true},
        );

        if(!user){
            return res.status(404).json({message: 'Thought created, but found no user with that id!'});
        }

        res.json('Created the Thought Sucessfully!');
        return;
    } catch(err: any){
        console.log(err);
        res.status(500).json(err);
        return;
    }
}