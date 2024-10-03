import { Schema, model, Document } from 'mongoose';
import Reaction from './Reaction.js'

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: typeof Reaction[];
}

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: [1, 'Text field cannot be empty!'],
            maxlength: [280, 'Cannot be more than 280 characters long! Got {VALUE}.']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //getter method to format on query
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    .get(function (){
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema)
export default Thought;