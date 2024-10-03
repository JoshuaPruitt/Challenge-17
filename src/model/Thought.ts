import { Schema, model, Document } from 'mongoose';
// import Reaction from './Reaction.js'

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
}