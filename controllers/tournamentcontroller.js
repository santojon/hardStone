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

                    var score = [0, 0]
                    rounds.forEach((round) => {
                        if (round[0].win) score[0] = score[0] + 1
                        if (round[1].win) score[1] = score[1] + 1
                        setMatchresultDetails(round)
                    })
                    
                    var isWinner0 = (score[0] > score[1]) ? 'winner' : 'loser'
                    var isWinner1 = (score[0] < score[1]) ? 'winner' : 'loser'
                    
                    var view = document.getElementById('match-details-tb-footer')
                    view.innerHTML =
                        '<td class="col-md-6 col-sm-6 col-lg-6 '
                            + isWinner0 + '"><h4>' + score[0] + '</h4></td>' +
                        '<td class="col-md-6 col-sm-6 col-lg-6 '
                            + isWinner1 + '"><h4>' + score[1] + '</h4></td>'
                    
                    // put back users info
                    rounds.reverse()
                    rounds.push(users)
                    rounds.reverse()
                }
            }
        },
        /**
         * Add users details to detailed view
         */
        setMatchUsersDetails: (users) => {
            var left = document.getElementById('left-user')
            var right = document.getElementById('right-user')
            
            document.getElementById('match-left-user').innerHTML = users[0].username
            document.getElementById('match-right-user').innerHTML = users[1].username
            
            left.innerHTML = '<img class="match-img" src="' + users[0].image + '">'
            right.innerHTML = '<img class="match-img" src="' + users[1].image + '">'
        },
        /**
         * Add result row in detailed view
         */
        setMatchresultDetails: (round) => {
            var result = []
            var view = document.getElementById('match-details-tb-body')
            
            var isWinner0 = round[0].win ? 'winner' : 'loser'
            var isWinner1 = round[1].win ? 'winner' : 'loser'

            result.push(
                '<tr>\
                    <td class="col-md-6 col-sm-6 col-lg-6 ' + isWinner0 + '">'
                        + round[0].hero + '<img src="assets/images/' + round[0].hero + '.jpg"></td>\
                    <td class="col-md-6 col-sm-6 col-lg-6 ' + isWinner1 + '">'
                        + round[1].hero + '<img src="assets/images/' + round[1].hero + '.jpg"></td>\
                    ' + '</tr>'
            )
            
            view.innerHTML = result.join('')

            document.getElementById('match-details-close').onclick = () => {
                hideItem('match-details')
                showItem('tournament-brackets')
            }
            hideItem('tournament-brackets')
            showItem('match-details')
        }
    })
}