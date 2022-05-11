import { animateOnce, changeBalance, randElem, randInt, setBalanceField } from "./functions.js"

let body = document.querySelector('.wrapper')
let rouletteCont = document.querySelector('.inner_roulette_cont')
let coinCont = document.querySelector('.coin_cont')
let warning = document.querySelector('.warning')

setBalanceField()
let balance = document.querySelector('.balance')

let rouletteCells = [7, 19, 1, 27, 2, 20, 0, 28, 8, 6, 35, 21, 11, 3, 17, 22, 12, 9, 18, 4, 31, 13, 10, 23, 32, 5, 14, 26, 33, 24, 30, 25, 15, 29, 34, 16, 36]
let coins = [5, 10, 50, 100, 500, 1000]

let currentCoin = false
let bet = { "1-18": 0, "0": 0, "19-36": 0 }
let betCf = { "1-18": 2, "0": 36, "19-36": 2 }
let totalBet = 0
let active = true

generateRoulette()
generateRoulette()

for (let coin of coins) {
    let coinPic = document.createElement('img')
    coinPic.src = '../png/' + coin + '.png'

    coinPic.onclick = () => {
        for (let c of coinCont.querySelectorAll('img')) {
            c.classList.remove('active')
        }
        coinPic.classList.add('active')

        currentCoin = coin
    }

    coinCont.appendChild(coinPic)
}

document.querySelector('.player .avatar').src = '../png/avatar_' + localStorage.getItem('chosen_r') + '.png'
document.querySelector('.player .block').innerHTML = localStorage.getItem('name_r')

let avatarNums = [1, 2, 3, 4, 5]
avatarNums.splice(avatarNums.indexOf(Number(localStorage.getItem('chosen_r'))), 1)

let friendList = localStorage.getItem('friends_r').split(',')
let friendBalance = {}
friendList.forEach((f) => { friendBalance[f] = { balance: randInt(9000, 25000), currentBet: { "1-18": 0, "0": 0, "19-36": 0 }, currentTotalBet: 0 } })

for (let num of ['one', 'two', 'three', 'four']) {
    let friend = document.querySelector('.friend.' + num)

    friend.querySelector('.avatar').src = '../png/avatar_' + avatarNums[avatarNums.length - 1] + '.png'
    avatarNums.pop()

    let friendName = friendList.pop()
    friend.querySelector('.name').innerHTML = friendName
    friend.querySelector('.friend_balance').innerHTML = friendBalance[friendName].balance
}

for (let option of document.querySelectorAll('.bet_option')) {
    option.onclick = (ev) => {
        if (!currentCoin || !active) { return }
        if (totalBet + currentCoin > Number(balance.innerHTML)) {
            animateOnce('.balance')
            return
        }

        let coinPic = document.createElement('img')
        coinPic.classList.add('coin')
        coinPic.src = '../png/' + currentCoin + '.png'

        let optionCoords = ev.currentTarget.getBoundingClientRect();
        coinPic.style.left = ev.clientX - optionCoords.left - 18 + 'px'
        coinPic.style.top = ev.clientY - optionCoords.top - 18 + 'px'

        option.appendChild(coinPic)

        bet[option.dataset.option] += currentCoin
        totalBet += currentCoin
    }
}

document.querySelector('.bet_button').onclick = () => {
    if (!active || !totalBet) { return }
    if (totalBet > Number(balance.innerHTML)) {
        animateOnce('.balance')
        return
    }

    active = false
    changeBalance(-totalBet)

    generateRoulette()

    let outcome = randElem(rouletteCells)
    let winOption = !outcome ? "0" : (outcome <= 18 ? "1-18" : "19-36")

    let prize = bet[winOption] * betCf[winOption]
    let friendPrize = {}

    for (let friend of document.querySelectorAll('.friend')) {
        let friendName = friend.querySelector('.name').innerHTML

        if (friendBalance[friendName].balance <= 3000) { return }

        friend.querySelector('.avatar').classList.add('active')
        setTimeout(() => {
            friend.querySelector('.avatar').classList.remove('active')
        }, 200);

        for (let i = 0; i < 3; i++) {
            let coin = randElem(coins)
            let coinPic = document.createElement('img')
            coinPic.src = '../png/' + coin + '.png'

            coinPic.style.top = randInt(0, 115) + 'px'
            coinPic.style.left = randInt(0, 85) + 'px'

            setTimeout(() => {
                let option = randElem(document.querySelectorAll('.bet_option'))
                friendBalance[friendName].currentBet[option.dataset.option] += coin
                friendBalance[friendName].currentTotalBet += coin
                option.appendChild(coinPic)
            }, 300 * (i + 1));
        }

        setTimeout(() => {
            friendPrize[friendName] = friendBalance[friendName].currentBet[winOption]
            friendBalance[friendName].balance -= friendBalance[friendName].currentTotalBet
            friend.querySelector('.friend_balance').innerHTML = friendBalance[friendName].balance
        }, 1250);
    }

    setTimeout(() => {
        rouletteCont.style.left = -1110 + 270 - rouletteCells.indexOf(outcome) * 30 + 'px'

        let warningText = warning.querySelector('.text')
        warningText.innerHTML = prize ? 'Congrats!<br><br>' : 'No way!<br><br>'
        warningText.innerHTML += 'You have won: ' + prize + '<br><br>'

        for (let friendName of Object.keys(friendPrize)) {
            warningText.innerHTML += friendName + ' won: ' + friendPrize[friendName] + '<br>'

            friendBalance[friendName].balance += friendPrize[friendName]

            friendBalance[friendName].currentTotalBet = 0
            friendBalance[friendName].currentBet = { "1-18": 0, "0": 0, "19-36": 0 }
        }
    }, 1300);

    setTimeout(() => {
        warning.style.left = '25%'
        changeBalance(prize)
    }, 3600);
}

document.querySelector('.again').onclick = () => {
    document.querySelectorAll('.friend').forEach((friend) => {
        friend.querySelector('.friend_balance').innerHTML = friendBalance[friend.querySelector('.name').innerHTML].balance
    })

    document.querySelectorAll('.bet_option img').forEach((img) => { img.parentElement.removeChild(img) })

    rouletteCont.style.transition = 'none'
    rouletteCont.style.left = 0

    setTimeout(() => {
        rouletteCont.style.transition = 'left 2s ease'
    }, 50);

    totalBet = 0
    bet = { "1-18": 0, "0": 0, "19-36": 0 }

    active = true

    warning.style.left = '-60%'
}

function generateRoulette() {
    for (let cellNum of rouletteCells) {
        let cell = document.createElement('div')
        if (rouletteCells.indexOf(cellNum) % 2 == 0) {
            cell.classList.add('red')
        } else {
            cell.classList.add('black')
        }
        cell.innerHTML = cellNum

        rouletteCont.appendChild(cell)
    }
}