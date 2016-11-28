with (Sgfd.Base) {
    var TournamentController = new Sgfd.Controller({
        metaName: 'TournamentController',
        /**
         * Get data from content provider and render
         */
        index: () => {
            // Create torunament using Bracket.js
            $(function() {
                $('#tournament-brackets').bracket({
                    teamWidth: 100,
                    scoreWidth: 30,
                    matchMargin: 30,
                    roundMargin: 60,
                    //skipSecondaryFinal: true,
                    skipConsolationRound: false,
                    skipGrandFinalComeback: false,
                    init: tournamentContent,
                    onMatchClick: TournamentController.onMatchClick,
                    decorator: {
                        edit: () => {},
                        render: TournamentController.render
                    }
                })
            })
        },
        /**
         * Render given tournament data
         */
        render: (container, data, score, state) => {
            switch(state) {
                case "empty-bye":
                    container.append("No team")
                    return;
                case "empty-tbd":
                    container.append("Upcoming")
                    return;
            
                case "entry-no-score":
                case "entry-default-win":
                case "entry-complete":
                    container.append(
                        '<img class="img-tournament-usr" src="' + data.user.image + '" /> '
                    ).append(data.user.username)
                    return;
            }
        },
        /**
         * Get subscriptions and create a reliable tem data to render page
         */
        assembleTeamsData: () => {
            var ok = SubscriptionController.getSubscriptionsBy({status: true})
            ok = ok.orderBy('created')
            var res = []
            var r = []

            var odd = (ok.length % 2) !== 0
            for (i = 0; i < ok.length; i++) {
                if ((i % 2) === 0) {
                    r.push(ok[i])
                } else {
                    r.push(ok[i])
                    res.push(r)
                    r = []
                }

                if ((i === (ok.length - 1)) && odd) {
                    r.push(null)
                    res.push(r)
                    r = []
                }
            }

            return res
        },
        /**
         * Show details on match click
         */
        onMatchClick: (rounds) => {
            with (TournamentController) {
                if (rounds) {
                    // get users info
                    rounds.reverse()
                    var users = rounds.pop()
                    rounds.reverse()

                    // set user data to details view
                    setMatchUsersDetails(users)

                    rounds.forEach((round) => {
                        setMatchresultDetails(round)
                    })
                }
            }
        },
        /**
         * Add users details to detailed view
         */
        setMatchUsersDetails: (users) => {
            var view = document.getElementById('match-details-content')
            view.innerHTML = 'asdasdasdasdasd'

            console.log(users)
        },
        /**
         * Add result row in detailed view
         */
        setMatchresultDetails: (round) => {
            var view = document.getElementById('match-details-content')

            console.log(round[0].hero)
            console.log(round[0].win)

            console.log(round[1].hero)
            console.log(round[1].win)

            document.getElementById('match-details-close').onclick = () => {
                hideItem('match-details')
                showItem('tournament-brackets')
            }
            hideItem('tournament-brackets')
            showItem('match-details')
        }
    })
}