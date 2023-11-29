let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");

  // Fetch toy data and render cards on page load
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const toyCard = createToyCard(toy);
          toyCollection.appendChild(toyCard);
        });
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Create a new toy card
  function createToyCard(toy) {
    const toyCard = document.createElement("div");
    toyCard.classList.add("card");

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    return toyCard;
  }

  // Handle form submission to add a new toy
  addToyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then(response => response.json())
      .then(createdToy => {
        const toyCard = createToyCard(createdToy);
        toyCollection.appendChild(toyCard);
      })
      .catch(error => console.error("Error adding new toy:", error));

    event.target.reset(); // Reset the form
  });

  // Handle like button click to update toy likes
  toyCollection.addEventListener("click", function (event) {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.dataset.id;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: parseInt(event.target.previousElementSibling.textContent) + 1,
        }),
      })
        .then(response => response.json())
        .then(updatedToy => {
          const toyCard = document.querySelector(`.card[data-id="${toyId}"]`);
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => console.error("Error updating likes:", error));
    }
  });

  // Initial fetch of toys on page load
  fetchToys();
});
