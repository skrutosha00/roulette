import { randElem, randInt, setBalanceField, shuffle } from './functions.js'

let friendCont = document.querySelector('.online')
let nameField = document.querySelector('.name')

let friendNicks = ['Rich', 'Bob', 'Maria', 'Kira', 'Milky', 'Mike', 'Nick', 'Player', 'Paul', 'Rick', 'Alex', 'Marta', 'Mellon', 'Baddy', 'Ultra', 'Kira', 'Kim', 'Cat', 'Joker', 'Bat', 'Loo', 'SoSo', 'Lena', 'Angel', 'Devil', 'Nice', 'Megan', 'Boy', 'Lara', 'Lara', 'Lora', 'Jack', 'John', 'Bobby']
let activeNicks = []

setBalanceField()

for (let i = 0; i < 4; i++) {
    let friendNicksShuffled = shuffle(friendNicks)

    let friend = document.createElement('div')
    friend.classList.add('block')

    let friendNick = friendNicksShuffled[i]
    friendNick += randElem(['@', '_', '__', '--', '-', '0'])
    friendNick += randInt(0, 99)

    friend.innerHTML = friendNick
    activeNicks.push(friendNick)

    friendCont.appendChild(friend)
}

localStorage.setItem('friends_r', activeNicks)

nameField.innerHTML = localStorage.getItem('name_r')

let avatar = document.createElement('img')
avatar.src = '../png/avatar_' + localStorage.getItem('chosen_r') + '.png'
avatar.classList.add('avatar')
nameField.appendChild(avatar)