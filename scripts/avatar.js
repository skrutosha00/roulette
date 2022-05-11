let avatarCont = document.querySelector('.avatar_cont')
let input = document.querySelector('input')

if (!localStorage.getItem('balance_r')) {
    localStorage.setItem('balance_r', 10000)
}

if (!localStorage.getItem('name_r')) {
    localStorage.setItem('name_r', 'Player')
} else {
    input.value = localStorage.getItem('name_r')
}

for (let i = 0; i < 5; i++) {
    let avatar = document.createElement('img')
    avatar.src = '../png/avatar_' + (i + 1) + '.png'
    avatar.classList.add('avatar')
    avatar.dataset.num = i + 1

    avatar.onclick = () => {
        for (let av of document.querySelectorAll('.avatar')) { av.classList.remove('active') }
        avatar.classList.add('active')
        localStorage.setItem('chosen_r', avatar.dataset.num)
    }

    avatarCont.appendChild(avatar)
}

input.onblur = () => {
    localStorage.setItem('name_r', input.value)
}