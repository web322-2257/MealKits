//Sample data
let mealKits = [
  {
    title: "Sautéed Ground Pork over Jasmine Rice",
    includes: "Toasted Peanuts & Quick-Pickled Cucumber Salad",
    description: "Gingery pork, crunchy cucumbers, and toasty peanuts.",
    category: "Classic Meals",
    price: 19.99,
    cookingTime: 25,
    servings: 2,
    imageUrl: "/assets/pork-rice.jpg",
    featuredMealKit: true
  },
  {
    title: "Lemon Herb Chicken with Roasted Potatoes",
    includes: "Green Beans & Garlic Aioli",
    description: "Juicy chicken with zesty lemon and crispy potatoes.",
    category: "Classic Meals",
    price: 21.99,
    cookingTime: 35,
    servings: 2,
    imageUrl: "/assets/chicken-potatoes.jpg",
    featuredMealKit: false
  },
  {
    title: "Spaghetti Bolognese",
    includes: "Parmesan Cheese & Garlic Bread",
    description: "Rich tomato and beef sauce over spaghetti pasta.",
    category: "Classic Meals",
    price: 18.99,
    cookingTime: 30,
    servings: 2,
    imageUrl: "/assets/spaghetti.jpg",
    featuredMealKit: true
  },
  {
    title: "Beef Stir-Fry with Vegetables",
    includes: "Soy Garlic Sauce & Rice Noodles",
    description: "Tender beef strips tossed with crunchy veggies.",
    category: "Classic Meals",
    price: 20.49,
    cookingTime: 28,
    servings: 2,
    imageUrl: "/assets/beef-stirfry.jpg",
    featuredMealKit: false
  },
  {
    title: "Vegan Buddha Bowl",
    includes: "Chickpeas, Quinoa & Tahini Dressing",
    description: "Protein-packed vegan bowl with fresh veggies.",
    category: "Vegan Meals",
    price: 17.99,
    cookingTime: 22,
    servings: 2,
    imageUrl: "/assets/buddha-bowl.jpg",
    featuredMealKit: true
  },
  {
    title: "Tofu Stir-Fry with Broccoli",
    includes: "Sesame Sauce & Jasmine Rice",
    description: "Crispy tofu with stir-fried broccoli and sesame sauce.",
    category: "Vegan Meals",
    price: 16.49,
    cookingTime: 26,
    servings: 2,
    imageUrl: "/assets/tofu-stirfry.jpg",
    featuredMealKit: false
  }
];

// Exported functions
function getAllMealKits() {
  return mealKits;
}

function getFeaturedMealKits(mealkits) {
  return mealkits.forEach(meal => {
    meal.featuredMealKit = true;
  });

}

function getMealKitsByCategory(mealkits) {
  const grouped = {};

  mealkits.forEach(meal => {
    if (!grouped[meal.category]) {
      grouped[meal.category] = [];
    }
    grouped[meal.category].push(meal);
  });

  return Object.keys(grouped).map(categoryName => ({
    categoryName,
    mealKits: grouped[categoryName]
  }));
}

module.exports = {
  getAllMealKits,
  getFeaturedMealKits,
  getMealKitsByCategory
};