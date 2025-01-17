// database.js
export const database = {};

const serverEnv = 'production';
const serverUrlLocal = 'http://localhost:3000';
const serverUrlProd = 'http://exploding-kitchen.us-west-1.elasticbeanstalk.com/api';
const url = (serverEnv === 'production') ? serverUrlProd : serverUrlLocal;

/**
 * Fetches the challenge list from server.
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
  try {
    const response = await fetch(`${url}/recipes/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipe: recipeJSON }),
    });
    const result = await response.json();
    if (result.msg !== 'Successfully created a new recipe') {
      alert(result.msg);
      return false;
    }
    return true;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Updates a recipe in the database.
 * This function must only be called after calling loadDB().
 * @param {JSON} recipeJSON The JSON of the recipe to update.
 * @returns {Promise} Resolves true if the recipe was successfully updated, rejects otherwise.
 */
async function updateRecipe(recipeJSON) {
  try {
    const response = await fetch(`${url}/recipes/${recipeJSON.recipeId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipe: recipeJSON }),
    });
    const data = await response.json();
    if (data.msg !== 'Successfully edited a recipe') {
      alert(data.msg);
      return false;
    }
    return true;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Deletes a recipe from the database.
 * This function must only be called after calling loadDB();
 * @param {JSON} recipeJSON The JSON of the recipe to delete.
 * @returns {Promise} Resolves true if the recipe was successfully deleted, rejects otherwise.
 */
async function deleteRecipe(recipeJSON) {
  try {
    const response = await fetch(`${url}/recipes/${recipeJSON.recipeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
    const result = await response.json();
    if (result.msg !== 'Delete successful') {
      alert(result.msg);
      return false;
    }
    return true;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Update the server for completing a recipe
 * @param recipeJSON
 * @returns {Promise<unknown>}
 */
async function completeRecipe(recipeJSON) {
  try {
    if (localStorage.getItem('userToken') === null) {
      return 'No user';
    }
    const response = await fetch(`${url}/users/completedRecipes/${recipeJSON.recipeId}`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
    if (response.status === 503) {
      return 'Error';
    }
    if (response.status === 409) {
      return 'Conflict';
    }
    return 'Success';
  } catch (err) {
    throw new Error(err);
  }
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
    const response = await fetch(`${url}/recipes/spiceRating/${spiceLevel}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
    const recipe = await response.json();
    return recipe;
  } catch (err) {
    return new Error('Get recipe by spice level failed');
  }
}

/**
 * Get recipes by title.
 * @param {String} queryName The recipe name query.
 * @returns {Promise} Resolves with an array of recipe JSONs whose name contains the query,
 *                    rejects if it fails.
 */
async function getByName(query) {
  if (typeof query !== 'string') {
    return new Error('Query was not a string!');
  }
  const queryLower = query.toLowerCase();
  try {
    const recipesArray = await fetch(`${url}/recipes/searchByTitle/${queryLower}`);
    const result = await recipesArray.json();
    return result;
  } catch (err) {
    return new Error(`Could not find recipes that include ${query}`);
  }
}

/**
 * Returns a recipe json associated with the ID
 * @param {String} id The recipe id query.
 * @returns {Promise} Resolves with a recipe JSON whose id is the query,
 *                    rejects if it fails.
 */
async function getById(id) {
  try {
    if (typeof id !== 'number') {
      return new Error('Query was not a number!');
    }
    const response = await fetch(`${url}/recipeId/${id}`);
    const recipe = await response.json();
    return recipe;
  } catch (err) {
    return new Error('Get recipe by spice level failed');
  }
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
 * signup user by calling /auth/signup, and after user signed up, call login.
 * @param userPayload
 * @returns {Promise<Error>}
 */
async function signup(userPayload) {
  try {
    const response = await fetch(`${url}/auth/signup/`, {
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
 * Simply call load challenges from server instead of doing a local storage fetch
 * @returns {JSON} The challenge list JSON
 */
async function getChallenges() {
  const challenges = await loadChallengesFromServer();
  return challenges.challenges;
}

database.addRecipe = addRecipe;
database.updateRecipe = updateRecipe;
database.deleteRecipe = deleteRecipe;
database.getBySpice = getBySpice;
database.getByName = getByName;
database.getById = getById;
database.completeRecipe = completeRecipe;
database.getChallenges = getChallenges;
database.login = login;
database.signup = signup;
