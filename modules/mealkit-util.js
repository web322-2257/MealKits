let mealKits = [];

module.exports = function getAllMealKits(){
    return mealKits;
}

module.exports = function getFeaturedMealKits(mealkits){
    //flag to featured
    
    // use for each
    mealkits.array.forEach(mealkit => {
        mealkit.featuredMealKit = true;
    });

    return mealkits;
}


module.exports = function getMealKitsByCategory(mealkits){

    //group by category
    let groupedKits = Object.groupBy(mealkits, meal => meal.category);
    //check result of this, category should be first then rest of data
    return groupedKits;
}



