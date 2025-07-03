async function generateRecipe() {
  const ingredients = document.getElementById("ingredients").value;
  const diet = document.getElementById("diet").value;
  const resultDiv = document.getElementById("result");

  if (!ingredients.trim()) {
    resultDiv.innerText = "Please enter at least one ingredient.";
    return;
  }

  resultDiv.innerText = "Generating recipe... Please wait.";

  /* 🔁 TEMPORARY MOCK RECIPE (remove this block when switching back to API)
  const mockRecipe = `🌿 Creamy Garlic Mushroom Pasta

Ingredients:
- 200g pasta
- 1 tbsp olive oil
- 3 cloves garlic, minced
- 200g mushrooms, sliced
- 100ml heavy cream
- Salt and pepper to taste
- Fresh parsley for garnish

Cooking Time: 25 minutes

Instructions:
1. Cook pasta according to package instructions. Drain and set aside.
2. Heat olive oil in a pan over medium heat. Add garlic and sauté for 1 minute.
3. Add mushrooms and cook until soft and browned (about 5-6 minutes).
4. Pour in the cream and stir well. Simmer for 5 minutes.
5. Add the cooked pasta to the sauce and toss to coat evenly.
6. Season with salt and pepper. Garnish with parsley and serve hot.`;
*/

  const data = { recipe: mockRecipe };

  // 🛑 COMMENTED OUT — REMOVE COMMENTS WHEN API IS READY
  
  const prompt = `Create a ${diet !== "none" ? diet : ""} recipe using the following ingredients: ${ingredients}. Include a creative title, ingredients with quantities, cooking time, and clear step-by-step instructions. Format the output as follows: Title, Ingredients (in bullet points), Cooking Time, and Instructions (numbered).`;

  try {
    const response = await fetch("/generate-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "An error occurred. Please try again.";
    return;
  }
  

  if (data.recipe) {
    resultDiv.innerHTML = formatRecipeHTML(data.recipe);
  } else {
    resultDiv.innerText = data.error || "No recipe found.";
  }
}

function formatRecipeHTML(text) {
  const lines = text.split('\n').filter(line => line.trim() !== "");
  let html = "";
  let inList = false;
  let inSteps = false;

  lines.forEach((line) => {
    if (/^[-*•]/.test(line.trim())) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.replace(/^[-*•]\s*/, "")}</li>`;
    } else if (/^\d+[\).]/.test(line.trim())) {
      if (!inSteps) {
        html += "<ol>";
        inSteps = true;
      }
      html += `<li>${line.replace(/^\d+[\).]\s*/, "")}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inSteps) {
        html += "</ol>";
        inSteps = false;
      }
      html += `<p><strong>${line}</strong></p>`;
    }
  });

  if (inList) html += "</ul>";
  if (inSteps) html += "</ol>";

  return html;
}