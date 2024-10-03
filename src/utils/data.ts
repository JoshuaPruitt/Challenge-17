
export const userData = [
    {
        username: 'Sponge',
        email: 'superSoak@email.com'
    },

    {
        username: 'IzziPop',
        email: 'izziEmail@email.com'
    },

    {
        username: 'joshLovesIzzi',
        email: 'joshEmail@email.com'
    }
];


const reactions = [
    {
        reactionBody: 'Man that really sucks :( im sorry!',
        username: userData[1].username,
    },

    {
        reactionBody: 'Haha Loser! Better luck next time!',
        username: userData[0].username,
    }, 

    {
        reactionBody: 'Really dude....',
        username: userData[1].username,
    }
]

export const thoughtData = [
    {
        thoughtText: `My dog juinie has a gambling addiction and it's killing my family :(`,
        username: userData[2].username,
        reactions: [reactions[0], reactions[1]]
    },

    {
        thoughtText: `I am so dark and mysterious...`,
        username: userData[0].username,
        reactions: [reactions[2]]
    }
]