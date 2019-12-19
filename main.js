var currentOutfit;
var outfits = [];
var id = 0;
var hatBox = document.getElementById('hat-box');
var hatsBtns = document.querySelectorAll('.hats-btn');
var tophatBtn = document.getElementById('tophat-btn');
var hatImgs = document.querySelectorAll('.hat');
var clothesBox = document.getElementById('clothes-box');
var clothesBtns = document.querySelectorAll('.clothes-btn');
var column1 = document.querySelector('.column1');
var accessoriesBox = document.getElementById('accessories-box');
var accessoriesBtns = document.querySelectorAll('.accessories-btn');
var sunhatImg = document.getElementById('sunhat-img');
var sunhatBtn = document.getElementById('sunhat-btn');
var tophatImg = document.getElementById('tophat-img');
var tophatBtn = document.getElementById('tophat-btn');
var images = document.querySelectorAll('.bear-outfits > *');
var saveBtn = document.getElementById('save-btn');
var outfitInput = document.getElementById('outfit-input');
var outfitStorage = document.querySelector('.outfit-storage');
var bearBackground = document.querySelector('.bear-background');
var backgroundBtnBox = document.querySelector('.background-btns');
var backgroundBtns = document.querySelectorAll('.background-btn');
var backgroundImgs = document.querySelectorAll('.background-btn');

backgroundBtnBox.addEventListener('click', function() {
  changeBackground(event.target.id);
  toggleBtnClass('background-btn', backgroundBtns);
});

column1.addEventListener('click', bounceBtn)

function bounceBtn() {
  if (event.target.tagName === 'BUTTON') {
    event.target.classList.remove('bounce');
    event.target.offsetWidth = event.target.offsetWidth;
    event.target.classList.add('bounce');
  }
}

function changeBackground(selector) {
  if (selector === 'beach') {
    bearBackground.style.backgroundImage = 'url("assets/beach.png")';
    currentOutfit.background = 'beach';
  } else if (selector === 'hearts') {
    bearBackground.style.backgroundImage = 'url("assets/hearts.png")';
    currentOutfit.background = 'hearts';
  } else if (selector === 'outerspace') {
    bearBackground.style.backgroundImage = 'url("assets/outerspace.png")';
    currentOutfit.background = 'outerspace';
  } else if (selector === "park") {
    bearBackground.style.backgroundImage = 'url("assets/park.png")';
    currentOutfit.background = 'park';
  } else if (selector === '') {
    bearBackground.style.backgroundImage = '';
  }
}

outfitInput.addEventListener('keyup', checkInput);


function clearForm() {
  outfitInput.value = '';
  saveBtn.setAttribute('disabled', 'disabled');
}

function checkInput() {
  if (outfitInput.value !== '') {
    saveBtn.removeAttribute('disabled')
  } else {
    saveBtn.setAttribute('disabled', 'disabled')
  }
}

checkForSavedCards();

hatBox.addEventListener('click', function() {
  addRemoveImages('hat');
  toggleBtnClass('hats-btn', hatsBtns);
});

accessoriesBox.addEventListener('click', function() {
  addRemoveImages('accessory');
  toggleBtnClass('accessories-btn', accessoriesBtns);
});

clothesBox.addEventListener('click', function() {
  addRemoveImages('clothing');
  toggleBtnClass('clothes-btn', clothesBtns);
});

outfitStorage.addEventListener('click', function() {
  removeOutfitCard(event);
  accessOutfits(event);
});

saveBtn.addEventListener('click', function() {
  pushCurrentOutfitToArray();
  createNewNameCard();
  clearForm();
  revertToNaked();
});


function checkForSavedCards() {
  if (localStorage.outfits === "[]" || localStorage.outfits === undefined) {
    createOutfit();
  } else {
    var retrievedOutfits = localStorage.getItem('outfits');
    var parsedOutfits = JSON.parse(retrievedOutfits);
    for (var i = 0; i < parsedOutfits.length; i++) {
      addSavedOutfitCard(parsedOutfits[i].id, parsedOutfits[i].title);
    }
    outfits = parsedOutfits;
    localStorage.setItem('outfits', JSON.stringify(outfits));
    id = outfits[outfits.length - 1].id;
    createOutfit();
  }
}



function createOutfit() {
  id++;
  currentOutfit = new Outfit(id);
};

function toggleBtnClass(buttonClass, buttonList) {
  if (event.target.classList.contains(buttonClass)) {
    event.target.classList.toggle('active');
    removeActiveBtnStates(buttonList);
  }
}

function removeActiveBtnStates(buttonList) {
  for (var i =0; i < buttonList.length; i++) {
    if (buttonList[i] !== event.target) {
      buttonList[i].classList.remove('active');
    }
  }
}

function removeAssociatedImage() {
  for (var i = 0; i < images.length; i++) {
    if (event.target.classList.contains(images[i].id)) {
      images[i].classList.remove('visible');
      currentOutfit.removeGarment(images[i].id);
    }
  }
}

function checkInactiveTarget(category) {
  for (var i = 0; i < images.length; i++) {
    if (images[i].classList.contains(category)) {
      images[i].classList.remove('visible');
      currentOutfit.removeGarment(images[i].id);
    }
  }
}

function findMatchingButton(){
  for (var i = 0; i < images.length; i++) {
    if (event.target.classList.contains(images[i].id)) {
      images[i].classList.add('visible');
      currentOutfit.addGarment(images[i].id);
    }
  }
}

function addRemoveImages(category){
  if (event.target.classList.contains('active')) {
    removeAssociatedImage();
  } else {
    checkInactiveTarget(category);
    findMatchingButton();
  }
}

function removeOutfitCard(event) {
  if (event.target.classList.contains('fa')) {
    event.target.parentNode.remove();
    var idOfClicked = parseInt(event.target.parentNode.id);
    for (var i = 0; i < outfits.length; i++) {
      if (idOfClicked === outfits[i].id) {
        outfits.splice(i, 1)
      }
    }
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }
}

function addSavedOutfitCard(id, title) {
  var outfitName = title;
  var outfitNameHTML =
  `<section id="${id}" class="outfit-card">
    <p>${outfitName}</p>
    <i class="fa fa-times-circle"></i>
  </section>`
  outfitStorage.insertAdjacentHTML('afterbegin', outfitNameHTML);
  localStorage.setItem('outfits', JSON.stringify(outfits));
}

function accessOutfits(event){
  var outfitToGrab = event.target.innerText;
  var stringOfOutfits = localStorage.getItem('outfits');
  var outfitsArr = JSON.parse(stringOfOutfits);
  for (var i = 0; i < outfitsArr.length; i++) {
    if (outfitsArr[i].title === outfitToGrab) {
      checkForGarments(outfitsArr[i]);
      changeBackground(outfitsArr[i].background);
    }
  }
}

function checkForGarments(obj) {
  for (var i = 0; i < images.length; i++) {
    if (obj.garments.indexOf(images[i].id) > -1) {
      images[i].classList.add('visible');
    } else {
      images[i].classList.remove('visible');
    }
  }
}

function checkForBackgrounds(obj) {

}

function createNewNameCard() {
  var outfitName = outfitInput.value;
  currentOutfit.title = outfitName;
  addSavedOutfitCard(currentOutfit.id, outfitName);
}

function pushCurrentOutfitToArray() {
  if (currentOutfit.garments !== [] || currentOutfit.background !== '') {
    outfits.push(currentOutfit);
  }
}

function revertToNaked() {
  var visibleGarments = document.querySelectorAll('.visible');
  for (var i = 0; i < visibleGarments.length; i++) {
    visibleGarments[i].classList.remove('visible');
  }
  bearBackground.style.backgroundImage = '';
  removeActiveBtnStates(hatsBtns);
  removeActiveBtnStates(clothesBtns);
  removeActiveBtnStates(accessoriesBtns);
  removeActiveBtnStates(backgroundBtns);
  createOutfit();
}
