import { Schema, model, Document, ObjectId } from 'mongoose';
import Reaction from './Reaction.js';

interface IUser extends Document {
    username: string;
    email: string;
    thoughts: ObjectId[];
    friends: ObjectId[];
    reactions: typeof Reaction[];
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'A user must have a username!'],
            unique: true,
            minlength: [3, 'A username must be more than 3 Characters, got {VALUE}!'],
            maxlength: [20, 'A username cannot be more than 20 Characters, got {VALUE}!'],
            //will trim all white space
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'A user must have an Email!'],
            maxlength: [50, 'A email cannot be more than 50 Characters, got {VALUE}!'],
            validate: {
                validator: function(v) {
                    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
                },
                message: props =>  `${props.value} is not a valid email address!`
            },

        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        reactions: [Reaction],
    },

    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

//create virtual that returns the friend count of a requested user
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });

userSchema
    .virtual('reactionCount')
    .get(function(){
        return this.reactions.length;
    });

const User = model('user', userSchema)

export default User;