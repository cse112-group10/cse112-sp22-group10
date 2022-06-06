// database.js
export const database = {};

const serverEnv = 'production';
const serverUrlLocal = 'http://localhost:3000';
const serverUrlProd = 'http://exploding-kitchen.us-west-1.elasticbeanstalk.com/api';
const url = (serverEnv === 'production') ? serverUrlProd : serverUrlLocal;

/**
 * load challenges
 * @returns {Promise<void>}
 */
async function loadChallenges() {
  await loadChallengesFromServer()
    .then((challenges) => {
      saveChallenges(challenges);
    });
}

/**
 * TODO: change the following to match the challenges.json (will need a new route).
 * Fetches the challenge list from file.
 * @returns {Promise} Resolves with the challenge list json if successful, rejects otherwise.
 */
async function loadChallengesFromServer() {
  try {
    const response = await fetch(`${url}/recipes/challenges`, {
      method: 'GET',
      headers: {
        Authorization: `bearer ${localStorage.getItem('userToken')}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response.json();
    const result = {
      challenges: data.challengesWithRecipes,
    };
    return result;
  } catch (err) {
    return err;
  }
}

/**
 * Adds a recipe to the database.
 * If a recipe of the same name already exists, does not add in the recipe.
 * This function must only be called after calling loadDB().
 * @param {JSON} recipeJSON The JSON of the recipe to add.
 * @returns {Promise} Resolves true if the recipe was successfully added, rejects otherwise.
 */
async function addRecipe(recipeJSON) {
  // TODO: fetch POST /recipe with recipeJSON as the body. https://github.com/cse112-group10/cse112-sp22-group10/blob/main/source/backend/routes/recipes.js#L104
}

/**
 * Updates a recipe in the database.
 * This function must only be called after calling loadDB().
 * @param {JSON} recipeJSON The JSON of the recipe to update.
 * @returns {Promise} Resolves true if the recipe was successfully updated, rejects otherwise.
 */
async function updateRecipe(recipeJSON) {
  // TODO: fetch PUT /recipe/:recipeId, with the authorization header + recipeId param. https://github.com/cse112-group10/cse112-sp22-group10/blob/main/source/backend/routes/recipes.js#L32
}

/**
 * Deletes a recipe from the database.
 * This function must only be called after calling loadDB();
 * @param {JSON} recipeJSON The JSON of the recipe to delete.
 * @returns {Promise} Resolves true if the recipe was successfully deleted, rejects otherwise.
 */
async function deleteRecipe(recipeJSON) {
  // TODO: fetch DELETE /recipe/:recipeId: https://github.com/cse112-group10/cse112-sp22-group10/blob/main/source/backend/routes/recipes.js#L119
}

/**
 * TODO: refactor this function to save challenge in the backend instead of localstorage
 *
 * Saves the challenge JSON into local storage
 * @param {JSON} challengeJSON The JSON to save
 */
function saveChallenges(challengeJSON) {
  const challengeString = JSON.stringify(challengeJSON);
  localStorage.setItem('challenges', challengeString);
}
/**
 * TODO: lots of refactoring of this function
 * @param recipeJSON
 * @returns {Promise<unknown>}
 */
async function completeRecipe(recipeJSON) {
  return new Promise((resolve, reject) => {
    // TODO: get it from the backend
    const challengeJSON = JSON.parse(localStorage.getItem('challenges'));

    // KEEP
    for (let i = 0; i < recipeJSON.challenges.length; i += 1) {
      for (let j = 0; j < challengeJSON.challenges.length; j += 1) {
        if (challengeJSON.challenges[j].title === recipeJSON.challenges[i]) {
          challengeJSON.challenges[j].numberCompleted += 1;
          break;
        }
      }
    }

    // KEEP below
    recipeJSON.completed = true;
    updateRecipe(recipeJSON)
      .then(() => {
        saveChallenges(challengeJSON);
        resolve(true);
      });
  });
}

/**
 * Gets a list of recipes that have a given spice level.
 * @param {Number} spiceLevel The spice level query between 1 and 5 inclusive.
 * @returns {Promise} Resolves with an array of recipe JSONs that match the query spice level,
 *                    rejects if spice level out of range.
 */
async function getBySpice(spiceLevel) {
  try {
    if (typeof spiceLevel !== 'number') {
      return new Error('Query was not a number!');
    } if (spiceLevel < 1 || spiceLevel > 5) {
      return new Error('Spice level out of range!');
    }
    const response = await fetch(`${url}/recipes/spiceRating/${spiceLevel}`);
    const recipe = await response.json();
    return recipe;
  } catch (err) {
    return new Error('Get recipe by spice level failed');
  }
}

/**
 * TODO: need a route for this as well. GET /recipes/:title
 * @param {String} queryName The recipe name query.
 * @returns {Promise} Resolves with an array of recipe JSONs whose name contains the query,
 *                    rejects if it fails.
 */
async function getByName(query) {
  if (typeof query !== 'string') {
    return new Error('Query was not a string!');
  } else {
    const queryLower = query.toLowerCase();
    try {
      const recipesArray = await fetch(`${url}/recipes/searchByTitle/${queryLower}`);
      const result = await recipesArray.json();
      return result;
    } catch (err) {
      return new Error ('Could not find recipes that include ' + query);
    }
  }
}

/**
 * Returns a recipe json associated with the ID
 * @param {String} id The recipe id query.
 * @returns {Promise} Resolves with a recipe JSON whose id is the query,
 *                    rejects if it fails.
 */
async function getById(id) {
  return new Promise((resolve, reject) => {
    // TODO: replace the below with fetch GET /recipeId/:recipeId
    // db.recipes.get(id)
    //   .then((data) => {
    //     resolve(data.recipe_data);
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
  });
}

/**
 * fetch the token of the given userPayload
 * @param userPayload
 * @returns {Promise<Error>}
 */
async function login(userPayload) {
  try {
    const response = await fetch(`${url}/auth/login/`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload), // body data type must match "Content-Type" header
    });
    const data = await response.json();
    if (data.accessToken) {
      setUserToken(data.accessToken);
    }
    return data;
  } catch (err) {
    return new Error('Password or username incorrect, please try again');
  }
}

/**
 * set the user access token
 * @param token
 */
function setUserToken(token) {
  localStorage.setItem('userToken', token);
}

/**
 * TODO: modify to use challenge route. add a GET /user/completedChallenges
 * @returns {JSON} The challenge list JSON
 */
function getChallenges() {
  return JSON.parse(localStorage.getItem('challenges'));
}

database.loadChallenges = loadChallenges;
database.addRecipe = addRecipe;
database.updateRecipe = updateRecipe;
database.deleteRecipe = deleteRecipe;
database.completeRecipe = completeRecipe;
database.getBySpice = getBySpice;
database.getByName = getByName;
database.getById = getById;
database.getChallenges = getChallenges;
database.login = login;
