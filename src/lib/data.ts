import { Category, ColoringPage } from "@/types";

export const categories: Category[] = [
  // 1) Animals
  { id: "1", title: "Animals", slug: "animals", description: "Wonderful animal coloring pages", imageUrl: "/images/animals.png" },
  { id: "1-1", title: "Mammals", slug: "mammals", parentSlug: "animals" },
  { id: "1-2", title: "Birds", slug: "birds", parentSlug: "animals" },
  { id: "1-3", title: "Fish", slug: "fish", parentSlug: "animals" },
  { id: "1-4", title: "Reptiles", slug: "reptiles", parentSlug: "animals" },
  { id: "1-5", title: "Amphibians", slug: "amphibians", parentSlug: "animals" },
  { id: "1-6", title: "Insects", slug: "insects", parentSlug: "animals" },
  { id: "1-7", title: "Pets", slug: "pets", parentSlug: "animals" },
  { id: "1-8", title: "Wild Animals", slug: "wild-animals", parentSlug: "animals" },
  { id: "1-9", title: "Farm Animals", slug: "farm-animals", parentSlug: "animals" },
  { id: "1-10", title: "Marine Animals", slug: "marine-animals", parentSlug: "animals" },

  // 2) Cars & Transportation
  { id: "2", title: "Transportation", slug: "transportation" },
  { id: "2-1", title: "Cars", slug: "cars", parentSlug: "transportation" },
  { id: "2-2", title: "Trucks", slug: "trucks", parentSlug: "transportation" },
  { id: "2-3", title: "Buses", slug: "buses", parentSlug: "transportation" },
  { id: "2-4", title: "Motorcycles", slug: "motorcycles", parentSlug: "transportation" },
  { id: "2-5", title: "Bicycles", slug: "bicycles", parentSlug: "transportation" },
  { id: "2-6", title: "Trains", slug: "trains", parentSlug: "transportation" },
  { id: "2-7", title: "Planes", slug: "planes", parentSlug: "transportation" },
  { id: "2-8", title: "Ships & Boats", slug: "ships-boats", parentSlug: "transportation" },
  { id: "2-9", title: "Fantasy Vehicles", slug: "fantasy-vehicles", parentSlug: "transportation" },
  { id: "2-10", title: "Heavy Machinery", slug: "heavy-machinery", parentSlug: "transportation" },

  // 3) Landscapes
  { id: "3", title: "Landscapes", slug: "landscapes" },
  { id: "3-1", title: "Mountains", slug: "mountains", parentSlug: "landscapes" },
  { id: "3-2", title: "Forests", slug: "forests", parentSlug: "landscapes" },
  { id: "3-3", title: "Beaches", slug: "beaches", parentSlug: "landscapes" },
  { id: "3-4", title: "Deserts", slug: "deserts", parentSlug: "landscapes" },
  { id: "3-5", title: "Rivers & Lakes", slug: "rivers-lakes", parentSlug: "landscapes" },
  { id: "3-6", title: "Waterfalls", slug: "waterfalls", parentSlug: "landscapes" },
  { id: "3-7", title: "Gardens", slug: "gardens", parentSlug: "landscapes" },
  { id: "3-8", title: "Sky & Clouds", slug: "sky-clouds", parentSlug: "landscapes" },
  { id: "3-9", title: "Sunset & Sunrise", slug: "sunset-sunrise", parentSlug: "landscapes" },
  { id: "3-10", title: "Rural Landscapes", slug: "rural-landscapes", parentSlug: "landscapes" },

  // 4) Houses & Buildings
  { id: "4", title: "Buildings", slug: "buildings" },
  { id: "4-1", title: "Houses", slug: "houses", parentSlug: "buildings" },
  { id: "4-2", title: "Apartments", slug: "apartments", parentSlug: "buildings" },
  { id: "4-3", title: "Castles", slug: "castles", parentSlug: "buildings" },
  { id: "4-4", title: "Huts", slug: "huts", parentSlug: "buildings" },
  { id: "4-5", title: "Modern Buildings", slug: "modern-buildings", parentSlug: "buildings" },
  { id: "4-6", title: "Old Buildings", slug: "old-buildings", parentSlug: "buildings" },
  { id: "4-7", title: "Towers", slug: "towers", parentSlug: "buildings" },
  { id: "4-8", title: "Mosques", slug: "mosques", parentSlug: "buildings" },
  { id: "4-9", title: "Churches", slug: "churches", parentSlug: "buildings" },
  { id: "4-10", title: "Schools", slug: "schools", parentSlug: "buildings" },

  // 5) Characters
  { id: "5", title: "Characters", slug: "characters" },
  { id: "5-1", title: "Kids", slug: "kids", parentSlug: "characters" },
  { id: "5-2", title: "Families", slug: "families", parentSlug: "characters" },
  { id: "5-3", title: "Superheroes", slug: "superheroes", parentSlug: "characters" },
  { id: "5-4", title: "Princesses", slug: "princesses", parentSlug: "characters" },
  { id: "5-5", title: "Knights", slug: "knights", parentSlug: "characters" },
  { id: "5-6", title: "Fantasy Characters", slug: "fantasy-characters", parentSlug: "characters" },
  { id: "5-7", title: "Sports Characters", slug: "sports-characters", parentSlug: "characters" },
  { id: "5-8", title: "Occupations", slug: "occupations", parentSlug: "characters" },
  { id: "5-9", title: "Cartoon Characters", slug: "cartoon-characters", parentSlug: "characters" },

  // 6) Nature & Plants
  { id: "6", title: "Nature", slug: "nature" },
  { id: "6-1", title: "Trees", slug: "trees", parentSlug: "nature" },
  { id: "6-2", title: "Flowers", slug: "flowers", parentSlug: "nature" },
  { id: "6-3", title: "Plants", slug: "plants", parentSlug: "nature" },
  { id: "6-4", title: "Fruits", slug: "fruits", parentSlug: "nature" },
  { id: "6-5", title: "Vegetables", slug: "vegetables", parentSlug: "nature" },
  { id: "6-6", title: "Leaves", slug: "leaves", parentSlug: "nature" },
  { id: "6-7", title: "Cactus", slug: "cactus", parentSlug: "nature" },
  { id: "6-8", title: "Tropical Plants", slug: "tropical-plants", parentSlug: "nature" },
  { id: "6-9", title: "Seasons", slug: "seasons-nature", parentSlug: "nature" },

  // 7) Foods
  { id: "7", title: "Food", slug: "food" },
  { id: "7-1", title: "Sweets", slug: "sweets", parentSlug: "food" },
  { id: "7-2", title: "Pizza", slug: "pizza", parentSlug: "food" },
  { id: "7-3", title: "Burger", slug: "burger", parentSlug: "food" },
  { id: "7-4", title: "Drinks", slug: "drinks", parentSlug: "food" },
  { id: "7-5", title: "Fast Food", slug: "fast-food", parentSlug: "food" },
  { id: "7-6", title: "Traditional Dishes", slug: "traditional-dishes", parentSlug: "food" },
  { id: "7-7", title: "Cakes", slug: "cakes", parentSlug: "food" },
  { id: "7-8", title: "Ice Cream", slug: "ice-cream", parentSlug: "food" },

  // 8) Holidays & Occasions
  { id: "8", title: "Holidays", slug: "holidays" },
  { id: "8-1", title: "Eid al-Fitr", slug: "eid-al-fitr", parentSlug: "holidays" },
  { id: "8-2", title: "Eid al-Adha", slug: "eid-al-adha", parentSlug: "holidays" },
  { id: "8-3", title: "Ramadan", slug: "ramadan", parentSlug: "holidays" },
  { id: "8-4", title: "Christmas", slug: "christmas", parentSlug: "holidays" },
  { id: "8-5", title: "New Year", slug: "new-year", parentSlug: "holidays" },
  { id: "8-6", title: "Valentine's Day", slug: "valentines-day", parentSlug: "holidays" },
  { id: "8-7", title: "Halloween", slug: "halloween", parentSlug: "holidays" },
  { id: "8-8", title: "Birthdays", slug: "birthdays", parentSlug: "holidays" },
  { id: "8-9", title: "Back to School", slug: "back-to-school", parentSlug: "holidays" },
  { id: "8-10", title: "Parties", slug: "parties", parentSlug: "holidays" },

  // 9) Space
  { id: "9", title: "Space", slug: "space" },
  { id: "9-1", title: "Planets", slug: "planets", parentSlug: "space" },
  { id: "9-2", title: "Stars", slug: "stars", parentSlug: "space" },
  { id: "9-3", title: "Rockets", slug: "rockets", parentSlug: "space" },
  { id: "9-4", title: "Astronauts", slug: "astronauts", parentSlug: "space" },
  { id: "9-5", title: "Moons", slug: "moons", parentSlug: "space" },
  { id: "9-6", title: "Galaxies", slug: "galaxies", parentSlug: "space" },
  { id: "9-7", title: "Spacecraft", slug: "spacecraft", parentSlug: "space" },
  { id: "9-8", title: "Aliens", slug: "aliens", parentSlug: "space" },
  { id: "9-9", title: "Space Scenes", slug: "space-scenes", parentSlug: "space" },
  { id: "9-10", title: "Solar System", slug: "solar-system", parentSlug: "space" },

  // 10) Education
  { id: "10", title: "Education", slug: "education" },
  { id: "10-1", title: "Letters", slug: "letters", parentSlug: "education" },
  { id: "10-2", title: "Numbers", slug: "numbers", parentSlug: "education" },
  { id: "10-3", title: "Geometric Shapes", slug: "shapes", parentSlug: "education" },
  { id: "10-4", title: "Clock", slug: "clock", parentSlug: "education" },
  { id: "10-5", title: "School Tools", slug: "school-tools", parentSlug: "education" },
  { id: "10-6", title: "Science", slug: "science", parentSlug: "education" },
  { id: "10-7", title: "Maps", slug: "maps", parentSlug: "education" },
  { id: "10-8", title: "Educational Coloring", slug: "edu-coloring", parentSlug: "education" },
  { id: "10-9", title: "Simple Words", slug: "simple-words", parentSlug: "education" },
  { id: "10-10", title: "Exercises", slug: "exercises", parentSlug: "education" },

  // 11) Fantasy
  { id: "11", title: "Fantasy", slug: "fantasy" },
  { id: "11-1", title: "Dragons", slug: "dragons", parentSlug: "fantasy" },
  { id: "11-2", title: "Unicorns", slug: "unicorns", parentSlug: "fantasy" },
  { id: "11-3", title: "Magic", slug: "magic", parentSlug: "fantasy" },
  { id: "11-4", title: "Castles", slug: "fantasy-castles", parentSlug: "fantasy" },
  { id: "11-5", title: "Mythical Creatures", slug: "mythical-creatures", parentSlug: "fantasy" },
  { id: "11-6", title: "Legendary Heroes", slug: "legendary-heroes", parentSlug: "fantasy" },
  { id: "11-7", title: "Magical Forests", slug: "magical-forests", parentSlug: "fantasy" },
  { id: "11-8", title: "Fantasy Sky", slug: "fantasy-sky", parentSlug: "fantasy" },
  { id: "11-9", title: "Magic Books", slug: "magic-books", parentSlug: "fantasy" },
  { id: "11-10", title: "Fantasy Worlds", slug: "fantasy-worlds", parentSlug: "fantasy" },

  // 12) Sports
  { id: "12", title: "Sports", slug: "sports" },
  { id: "12-1", title: "Soccer", slug: "soccer", parentSlug: "sports" },
  { id: "12-2", title: "Basketball", slug: "basketball", parentSlug: "sports" },
  { id: "12-3", title: "Handball", slug: "handball", parentSlug: "sports" },
  { id: "12-4", title: "Tennis", slug: "tennis", parentSlug: "sports" },
  { id: "12-5", title: "Swimming", slug: "swimming", parentSlug: "sports" },
  { id: "12-6", title: "Horse Riding", slug: "horse-riding", parentSlug: "sports" },
  { id: "12-7", title: "Running", slug: "running", parentSlug: "sports" },
  { id: "12-8", title: "Gymnastics", slug: "gymnastics", parentSlug: "sports" },
  { id: "12-9", title: "Bicycles", slug: "sports-bicycles", parentSlug: "sports" },
  { id: "12-10", title: "Olympic Games", slug: "olympics", parentSlug: "sports" },

  // 13) Professions
  { id: "13", title: "Professions", slug: "professions" },
  { id: "13-1", title: "Doctor", slug: "doctor", parentSlug: "professions" },
  { id: "13-2", title: "Teacher", slug: "teacher", parentSlug: "professions" },
  { id: "13-3", title: "Policeman", slug: "policeman", parentSlug: "professions" },
  { id: "13-4", title: "Firefighter", slug: "firefighter", parentSlug: "professions" },
  { id: "13-5", title: "Engineer", slug: "engineer", parentSlug: "professions" },
  { id: "13-6", title: "Cook", slug: "cook", parentSlug: "professions" },
  { id: "13-7", title: "Farmer", slug: "farmer", parentSlug: "professions" },
  { id: "13-8", title: "Carpenter", slug: "carpenter", parentSlug: "professions" },
  { id: "13-9", title: "Mechanic", slug: "mechanic", parentSlug: "professions" },
  { id: "13-10", title: "Construction Worker", slug: "construction-worker", parentSlug: "professions" },

  // 14) Daily Objects
  { id: "14", title: "Daily Objects", slug: "daily-objects" },
  { id: "14-1", title: "Furniture", slug: "furniture", parentSlug: "daily-objects" },
  { id: "14-2", title: "Household Items", slug: "household-items", parentSlug: "daily-objects" },
  { id: "14-3", title: "Clothes", slug: "clothes", parentSlug: "daily-objects" },
  { id: "14-4", title: "Shoes", slug: "shoes", parentSlug: "daily-objects" },
  { id: "14-5", title: "Bags", slug: "bags", parentSlug: "daily-objects" },
  { id: "14-6", title: "Watches", slug: "watches", parentSlug: "daily-objects" },
  { id: "14-7", title: "Toys", slug: "toys", parentSlug: "daily-objects" },
  { id: "14-8", title: "Books", slug: "books", parentSlug: "daily-objects" },
  { id: "14-9", title: "Electronic Devices", slug: "electronics", parentSlug: "daily-objects" },
  { id: "14-10", title: "Kitchen Tools", slug: "kitchen-tools", parentSlug: "daily-objects" },

  // 15) Seasons & Weather
  { id: "15", title: "Seasons", slug: "seasons" },
  { id: "15-1", title: "Spring", slug: "spring", parentSlug: "seasons" },
  { id: "15-2", title: "Summer", slug: "summer", parentSlug: "seasons" },
  { id: "15-3", title: "Autumn", slug: "autumn", parentSlug: "seasons" },
  { id: "15-4", title: "Winter", slug: "winter", parentSlug: "seasons" },
  { id: "15-5", title: "Rain", slug: "rain", parentSlug: "seasons" },
  { id: "15-6", title: "Snow", slug: "snow", parentSlug: "seasons" },
  { id: "15-7", title: "Sun", slug: "sun", parentSlug: "seasons" },
  { id: "15-8", title: "Sea", slug: "sea-weather", parentSlug: "seasons" },
  { id: "15-9", title: "Picnics", slug: "picnics", parentSlug: "seasons" },
  { id: "15-10", title: "Camping", slug: "camping", parentSlug: "seasons" },
];


export const coloringPages: ColoringPage[] = [
  {
    id: "101",
    title: "Brave Lion",
    slug: "brave-lion",
    imageUrl: "/coloring-pages/lion.png",
    thumbnailUrl: "/coloring-pages/lion-thumb.png",
    categorySlug: "animals",
    subCategorySlug: "farm-animals",
    description: "King of the jungle lion coloring page",
    difficulty: "medium",
    ageGroup: "kids",
  },
  {
    id: "102",
    title: "Astronaut",
    slug: "astronaut",
    imageUrl: "/coloring-pages/astronaut.png",
    thumbnailUrl: "/coloring-pages/astronaut-thumb.png",
    categorySlug: "space",
    description: "An astronaut floating in the galaxy",
    difficulty: "hard",
    ageGroup: "adults",
  },
  {
    id: "birds-1",
    title: "Colorful Parrot",
    slug: "colorful-parrot-bird",
    imageUrl: "/images/Colorful parrot bird.jpg",
    thumbnailUrl: "/images/Colorful parrot bird.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "A beautiful parrot sitting on a branch coloring page.",
    views: 1450,
    downloads: 920,
    likes: 410,
    difficulty: "medium",
    ageGroup: "kids",
  },
  {
    id: "birds-2",
    title: "Cute Sparrow",
    slug: "cute-sparrow-bird-branch",
    imageUrl: "/images/Cute sparrow bird branch.jpg",
    thumbnailUrl: "/images/Cute sparrow bird branch.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "A cute little sparrow resting on a tree branch coloring page.",
    views: 980,
    downloads: 610,
    likes: 290,
    difficulty: "easy",
    ageGroup: "preschool",
  },
  {
    id: "birds-3",
    title: "European Goldfinch",
    slug: "european-goldfinch-bird",
    imageUrl: "/images/European goldfinch bird.jpg",
    thumbnailUrl: "/images/European goldfinch bird.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "Detailed European goldfinch bird coloring page.",
    views: 1120,
    downloads: 730,
    likes: 350,
    difficulty: "hard",
    ageGroup: "adults",
  },
  {
    id: "birds-4",
    title: "Cute Pigeon",
    slug: "cute-pigeon-bird",
    imageUrl: "/images/Cute pigeon bird.jpg",
    thumbnailUrl: "/images/Cute pigeon bird.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "A cute pigeon bird coloring page for kids.",
    views: 870,
    downloads: 540,
    likes: 260,
    difficulty: "easy",
    ageGroup: "toddler",
  },
];

export async function getAllCategories() {
  return categories;
}

export async function getCategories(parentSlug?: string) {
  return categories.filter((c) => c.parentSlug === parentSlug);
}

export async function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export async function getColoringPages(
  categorySlug: string,
  filters?: { difficulty?: string; ageGroup?: string }
) {
  return coloringPages.filter((p) => {
    if (p.categorySlug !== categorySlug && p.subCategorySlug !== categorySlug) return false;
    if (filters?.difficulty && p.difficulty !== filters.difficulty) return false;
    if (filters?.ageGroup && p.ageGroup !== filters.ageGroup) return false;
    return true;
  });
}

export async function getColoringPageBySlug(slug: string) {
  return coloringPages.find((p) => p.slug === slug);
}

export async function searchColoringPages(
  query: string,
  filters?: { difficulty?: string; ageGroup?: string }
) {
  const q = query.toLowerCase().trim();
  
  let matchedCategories: string[] = [];
  if (q) {
    matchedCategories = categories
      .filter(c => c.title.toLowerCase().includes(q))
      .map(c => c.slug);
  }

  return coloringPages.filter(p => {
    // 1. Text Search Match
    let textMatch = true;
    if (q) {
      textMatch = false;
      if (p.title.toLowerCase().includes(q)) textMatch = true;
      else if (p.description?.toLowerCase().includes(q)) textMatch = true;
      else if (matchedCategories.includes(p.categorySlug)) textMatch = true;
      else if (p.subCategorySlug && matchedCategories.includes(p.subCategorySlug)) textMatch = true;
    }
    
    if (!textMatch) return false;

    // 2. Filters Match
    if (filters?.difficulty && p.difficulty !== filters.difficulty) return false;
    if (filters?.ageGroup && p.ageGroup !== filters.ageGroup) return false;

    return true;
  });
}
