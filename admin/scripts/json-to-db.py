import json
import math
import pymysql

# Open the json file with all recipes
recipe_json = open('../../source/frontend/assets/jsons/All-Recipes.json')
recipes = json.load(recipe_json)

# Connect to RDS db, include password to the user
connect = pymysql.connect(host='exploding-kitchen-db.cjdmtmc8kuwg.us-west-1.rds.amazonaws.com', user='root', password='', db='recipes')
cursor = connect.cursor()

# Helper functions to convert format
def convertTimeToMin(obj):
    return obj['hours'] * 60 + obj['minutes']
    
def combineDirections(dirList):
    return '\n'.join(dirList)

# SQL table formats
# recipe (recipeId, title, description, image, servingsise, scoville, spiceRating, preptime, cooktime, totaltime, directions, challenge, userId)
# ingredients (ingredientId, name, quantity, units)
# recipeIngredients (recipeIngredientsId, recipeId, quantity, ingredientId)

ingredients = []
# Offsets to the IDs of ingredients entries and recipe ingredients
ingredIdOffset = 1000
recIngredIdOffset = 1000

for i, recipe in enumerate(recipes):
    # Corresponds to the ID of the table entry
    recipeId = i+1

    # Convert fields to correct format
    directions = combineDirections(recipe['directions'])
    prep_time = convertTimeToMin(recipe['time'][0])
    cook_time = convertTimeToMin(recipe['time'][1])
    total_time = convertTimeToMin(recipe['time'][2])

    # Determine if there is a challenge
    challenge = recipe['challenges'][0] if len(recipe['challenges']) else 'No Challenge'

    # Push all the ingredients in the recipe if it is new and
    # Create a recipe-ingredient relationship between them
    for ingred in recipe['ingredientList']:
        ingredStr = str(ingred).lower()
        ingredName = str(ingred['name']).lower()
        ingredQuant = float(ingred['quantity']) if ingred['quantity'] != '' else 1
        ingredUnits = ingred['units']
        if(ingredStr in ingredients):
            # if ingredient already in the set then update the id only
            ingredId = ingredients.index(ingredStr)+1+ingredIdOffset
        else:
            ingredId = len(ingredients)+1+ingredIdOffset
            ingredients.append(ingredStr)

            # push ingredient to the table 
            ingredVals = (ingredId, ingredName, ingredQuant, ingredUnits)
            cursor.execute("insert into ingredients \
                (ingredientId, name, quantity, units) \
                values (%s, %s, %s, %s)", ingredVals)

        # create recipeIngredients relationship
        recIngredIdOffset+=1
        recipeIngredVals = (recIngredIdOffset, recipeId, \
            math.ceil(ingredQuant) if ingred['quantity'] != '' else 1, ingredId)
        cursor.execute("insert into recipeIngredients \
            (recipeIngredientsId, recipeId, quantity, ingredientId) \
            values (%s, %s, %s, %s)", recipeIngredVals)

    # push the recipe
    recipeVals = (recipeId, recipe['title'], recipe['description'], recipe['image'], recipe['servingSize'], recipe['scoville'], recipe['spiceRating'], prep_time, cook_time, total_time, directions, challenge)
    cursor.execute("insert into recipes \
        (recipeId, title, description, image, \
        servingSize, scoville, spiceRating,  \
        prepTime, cookTime, totalTime, \
        directions, challenge) \
        values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", recipeVals)

# commit the queries
connect.commit()
connect.close()

