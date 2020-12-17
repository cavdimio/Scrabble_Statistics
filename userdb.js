module.exports =
    Users = [{
            _id: "5fae6b01eeab478c1207e2bf", //TODO unique username, email, 
            username: "cavdimio", //TODO Redesign the gamedb
            password: "1234",
            name: "Christos",
            friends: ["euxp1q23yqfg167s4316g4sq", "gert1qwe6qfg167s4316gs21", "pw451q23yqfg167s4316anm3"],
            insertedGames: [
                {
                    _id: "55348611a56c10449ab80a4f",
                    num_of_players: 4,
                    scores: [22, 18, 10, 10, 10, 36, 11, 23, 51, 6, 6, 26, 3, 6, 5, 2, -3, 12],
                    players: [{
                            _id: "euxp1q23yqfg167s4316g4sq",
                            name: "Konstantina",
                            scores: [12, 9, 8, 10, 14, 7, 28, 5, 6, 9, 5, 2, 1, 1, 9, 1, 1, 12]
                        },
                        {
                            _id: "gert1qwe6qfg167s4316gs21",
                            name: "Thanos",
                            scores: [23, 48, 69, 38, 49, 101, 11, 23, 11, 6, 6, -5, 3, 6, 5, 2, 1, 6]
                        },
                        {
                            _id: "pw451q23yqfg167s4316anm3",
                            name: "Afroditi",
                            scores: [52, 58, 50, 50, 50, 56, 11, 23, 51, 6, 6, 26, 3, 6, 5, 2, 12, 0]
                        }
                    ]
                },
                {
                    _id: "55348611a56c10449ab8wlr6",
                    num_of_players: 2,
                    scores: [8, 10, 9, 15, 12, 15, 26, 34, 14, 9, 14, 26, 15, 7, 21, 12, 28, 7, 15, 6, 2],
                    players: [{
                            _id: "euxp1q23yqfg167s4316g4sq",
                            name: "Konstantina",
                            scores: [14, 9, 11, 18, 7, 10, 11, 14, 13, 6, 3, 12, 16, 5, 4, 4, 5, 30, 16, 4, -4]
                        },
                        {
                            _id: null,
                            name: null,
                            scores: null
                        },
                        {
                            _id: null,
                            name: null,
                            scores: null
                        }
                    ]
                },
            ],
        },
        {
            _id: "euxp1q23yqfg167s4316g4sq",
            username: "konst1",
            password: "3456",
            name: "Konstantina",
            friends: ["5fae6b01eeab478c1207e2bf", "gert1qwe6qfg167s4316gs21", "pw451q23yqfg167s4316anm3"],
            insertedGames: [],
        },
        {
            _id: "gert1qwe6qfg167s4316gs21",
            username: "thanis1",
            password: "7890",
            name: "Thanos",
            friends: ["euxp1q23yqfg167s4316g4sq", "5fae6b01eeab478c1207e2bf"],
            insertedGames: [],
        },
        {
            _id: "pw451q23yqfg167s4316anm3",
            username: "afroad",
            password: "1357",
            name: "Afroditi",
            friends: ["euxp1q23yqfg167s4316g4sq", "5fae6b01eeab478c1207e2bf"],
            insertedGames: [],
        }
    ]

/* TODO Following
1) Login user
2) Add epilogi ass a friend (dummy players??) 
3) Alliws tha stelnei friend requests --> tha kataligoun edw kai sto email
4) Apodoxi paiktwn (notification system)
5) Add game 
*/