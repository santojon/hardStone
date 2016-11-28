var teams = TournamentController.assembleTeamsData()
var tournamentContent = {
    teams : teams,
    results : [
        [/* WINNER BRACKET */
            [
                [// the result
                    3, 2, [
                        [//the match users
                            teams[0][0].user,
                            teams[0][1].user
                        ],
                        // the detailed results
                        [
                            {
                                hero: 'mage',
                                win: true
                            },
                            {
                                hero: 'shaman',
                                win: false
                            }
                        ],
                        [
                            {
                                hero: 'priest',
                                win: true
                            },
                            {
                                hero: 'shaman',
                                win: false
                            }
                        ],
                        [
                            {
                                hero: 'druid',
                                win: false
                            },
                            {
                                hero: 'shaman',
                                win: true
                            }
                        ],
                        [
                            {
                                hero: 'druid',
                                win: false
                            },
                            {
                                hero: 'mage',
                                win: true
                            }
                        ],
                        [
                            {
                                hero: 'druid',
                                win: true
                            },
                            {
                                hero: 'hunter',
                                win: false
                            }
                        ]
                    ]
                ],
                //[2,3], [1,3], [3,0]
            ],
            [
                //[1,3], [3,2]
            ],
            [
                //[0,3]
            ]
        ],
        [/* LOSER BRACKET */
            [
                //[3,1], [3,2]
            ],
            [
                //[3,2], [1,3]
            ],
            [
                //[1,3]
            ],
            [
                //[3,0]
            ]
        ],
        [/* FINALS */
            [
                //[3,0], [1,3]
            ]
        ]
    ]
}