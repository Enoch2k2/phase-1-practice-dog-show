const baseUrl = 'http://localhost:3000';

let dogs = [];
let dogId = null;

const getEditForm = () => document.querySelector("#dog-form");

const attachSubmitToEditForm = () => {
  getEditForm().addEventListener('submit', submitDog);
}

const submitDog = e => {
  e.preventDefault();
  const editForm = getEditForm();
  const [nameInput, breedInput, sexInput] = editForm.children;
  const name = nameInput.value;
  const breed = breedInput.value;
  const sex = sexInput.value;
  
  fetch(baseUrl + '/dogs/' + dogId, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, breed, sex })
  })
  // edit the dog in the global dogs array, or re send a get request to the backend to grab all of the dogs
  .then(resp => resp.json())
  .then(data => loadDogs())

  nameInput.value = '';
  breedInput.value = '';
  sexInput.value = '';
  dogId = null;
}

const loadDogs = () => {
  const tbody = document.querySelector("#table-body")
  tbody.innerHTML = ''
  // we will fetch and get the dogs from the backend
  fetch(baseUrl + '/dogs')
    .then(resp => resp.json())
    .then(data => {
      dogs = data;
      renderAllDogs();
    })
}

const renderAllDogs = () => {
  // we want to iterate on the dogs and render each dog
  dogs.forEach(dog => renderDog(dog));
}

const renderDog = dog => {
  // create tr
  const tr = document.createElement('tr');
  // create td for dog name
  const nameTd = document.createElement('td');
  // create td for dog breed
  const breedTd = document.createElement('td');
  // create td for dog sex
  const sexTd = document.createElement('td');
  // create td for edit button
  const editTd = document.createElement('td');
  // create edit button
  const editButton = document.createElement('button');

  const tbody = document.querySelector("#table-body")

  nameTd.innerText = dog.name;
  breedTd.innerText = dog.breed;
  sexTd.innerText = dog.sex;


  editButton.innerText = 'Edit'

  editButton.addEventListener('click', () => {
    populateEditForm(dog);
  })
  // add button inside edit td
  editTd.appendChild(editButton);

  tr.appendChild(nameTd)
  tr.appendChild(breedTd)
  tr.appendChild(sexTd)
  tr.appendChild(editTd)
  // add tds inside of tr
  tbody.appendChild(tr);
  // add tr inside of tbody

}

const populateEditForm = dog => {
  // add the value of the dog attributes to the inputs
  const editForm = getEditForm();
  console.log('form', editForm.children);
  console.log('dog', dog);
  const [nameInput, breedInput, sexInput] = editForm.children;
  // const nameInput = editForm.children[0]
  // const breedInput = editForm.children[1]
  // const sexInput = editForm.children[2]
  nameInput.value = dog.name;
  breedInput.value = dog.breed;
  sexInput.value = dog.sex;
  dogId = dog.id;
}

document.addEventListener('DOMContentLoaded', () => {
 // refreshing the page makes anything here run
 loadDogs();

 // attach submit event to button for editing a dog
 attachSubmitToEditForm();
})