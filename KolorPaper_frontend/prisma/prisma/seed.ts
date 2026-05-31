import { prisma } from "../src/db.js";
import bcrypt from "bcryptjs";

const categories = [
  // 1) Animals
  { title: "Animals", slug: "animals", description: "Wonderful animal coloring pages", imageUrl: "/images/animals.jpg", parentSlug: null },
  { title: "Mammals", slug: "mammals", parentSlug: "animals" },
  { title: "Birds", slug: "birds", parentSlug: "animals" },
  { title: "Fish", slug: "fish", parentSlug: "animals" },
  { title: "Reptiles", slug: "reptiles", parentSlug: "animals" },
  { title: "Amphibians", slug: "amphibians", parentSlug: "animals" },
  { title: "Insects", slug: "insects", parentSlug: "animals" },
  { title: "Pets", slug: "pets", parentSlug: "animals" },
  { title: "Wild Animals", slug: "wild-animals", parentSlug: "animals" },
  { title: "Farm Animals", slug: "farm-animals", parentSlug: "animals" },
  { title: "Marine Animals", slug: "marine-animals", parentSlug: "animals" },

  // 2) Cars & Transportation
  { title: "Transportation", slug: "transportation", description: "Cars, planes, trains, and more", imageUrl: null, parentSlug: null },
  { title: "Cars", slug: "cars", parentSlug: "transportation" },
  { title: "Trucks", slug: "trucks", parentSlug: "transportation" },
  { title: "Buses", slug: "buses", parentSlug: "transportation" },
  { title: "Motorcycles", slug: "motorcycles", parentSlug: "transportation" },
  { title: "Bicycles", slug: "bicycles", parentSlug: "transportation" },
  { title: "Trains", slug: "trains", parentSlug: "transportation" },
  { title: "Planes", slug: "planes", parentSlug: "transportation" },
  { title: "Ships & Boats", slug: "ships-boats", parentSlug: "transportation" },
  { title: "Fantasy Vehicles", slug: "fantasy-vehicles", parentSlug: "transportation" },
  { title: "Heavy Machinery", slug: "heavy-machinery", parentSlug: "transportation" },

  // 3) Landscapes
  { title: "Landscapes", slug: "landscapes", description: "Nature's beautiful sceneries", imageUrl: null, parentSlug: null },
  { title: "Mountains", slug: "mountains", parentSlug: "landscapes" },
  { title: "Forests", slug: "forests", parentSlug: "landscapes" },
  { title: "Beaches", slug: "beaches", parentSlug: "landscapes" },
  { title: "Deserts", slug: "deserts", parentSlug: "landscapes" },
  { title: "Rivers & Lakes", slug: "rivers-lakes", parentSlug: "landscapes" },
  { title: "Waterfalls", slug: "waterfalls", parentSlug: "landscapes" },
  { title: "Gardens", slug: "gardens", parentSlug: "landscapes" },
  { title: "Sky & Clouds", slug: "sky-clouds", parentSlug: "landscapes" },
  { title: "Sunset & Sunrise", slug: "sunset-sunrise", parentSlug: "landscapes" },
  { title: "Rural Landscapes", slug: "rural-landscapes", parentSlug: "landscapes" },

  // 4) Houses & Buildings
  { title: "Buildings", slug: "buildings", description: "Castles, houses, and monuments", imageUrl: null, parentSlug: null },
  { title: "Houses", slug: "houses", parentSlug: "buildings" },
  { title: "Apartments", slug: "apartments", parentSlug: "buildings" },
  { title: "Castles", slug: "castles", parentSlug: "buildings" },
  { title: "Huts", slug: "huts", parentSlug: "buildings" },
  { title: "Modern Buildings", slug: "modern-buildings", parentSlug: "buildings" },
  { title: "Old Buildings", slug: "old-buildings", parentSlug: "buildings" },
  { title: "Towers", slug: "towers", parentSlug: "buildings" },
  { title: "Mosques", slug: "mosques", parentSlug: "buildings" },
  { title: "Churches", slug: "churches", parentSlug: "buildings" },
  { title: "Schools", slug: "schools", parentSlug: "buildings" },

  // 5) Characters
  { title: "Characters", slug: "characters", description: "Superheroes, princesses, and cartoons", imageUrl: null, parentSlug: null },
  { title: "Kids", slug: "kids", parentSlug: "characters" },
  { title: "Families", slug: "families", parentSlug: "characters" },
  { title: "Superheroes", slug: "superheroes", parentSlug: "characters" },
  { title: "Princesses", slug: "princesses", parentSlug: "characters" },
  { title: "Knights", slug: "knights", parentSlug: "characters" },
  { title: "Fantasy Characters", slug: "fantasy-characters", parentSlug: "characters" },
  { title: "Sports Characters", slug: "sports-characters", parentSlug: "characters" },
  { title: "Occupations", slug: "occupations", parentSlug: "characters" },
  { title: "Cartoon Characters", slug: "cartoon-characters", parentSlug: "characters" },

  // 6) Nature & Plants
  { title: "Nature", slug: "nature", description: "Trees, flowers, and seasonal nature", imageUrl: null, parentSlug: null },
  { title: "Trees", slug: "trees", parentSlug: "nature" },
  { title: "Flowers", slug: "flowers", parentSlug: "nature" },
  { title: "Plants", slug: "plants", parentSlug: "nature" },
  { title: "Fruits", slug: "fruits", parentSlug: "nature" },
  { title: "Vegetables", slug: "vegetables", parentSlug: "nature" },
  { title: "Leaves", slug: "leaves", parentSlug: "nature" },
  { title: "Cactus", slug: "cactus", parentSlug: "nature" },
  { title: "Tropical Plants", slug: "tropical-plants", parentSlug: "nature" },
  { title: "Seasons", slug: "seasons-nature", parentSlug: "nature" },

  // 7) Foods
  { title: "Food", slug: "food", description: "Delicious sweets and meals", imageUrl: null, parentSlug: null },
  { title: "Sweets", slug: "sweets", parentSlug: "food" },
  { title: "Pizza", slug: "pizza", parentSlug: "food" },
  { title: "Burger", slug: "burger", parentSlug: "food" },
  { title: "Drinks", slug: "drinks", parentSlug: "food" },
  { title: "Fast Food", slug: "fast-food", parentSlug: "food" },
  { title: "Traditional Dishes", slug: "traditional-dishes", parentSlug: "food" },
  { title: "Cakes", slug: "cakes", parentSlug: "food" },
  { title: "Ice Cream", slug: "ice-cream", parentSlug: "food" },

  // 8) Holidays & Occasions
  { title: "Holidays", slug: "holidays", description: "Celebrate events and holidays", imageUrl: null, parentSlug: null },
  { title: "Eid al-Fitr", slug: "eid-al-fitr", parentSlug: "holidays" },
  { title: "Eid al-Adha", slug: "eid-al-adha", parentSlug: "holidays" },
  { title: "Ramadan", slug: "ramadan", parentSlug: "holidays" },
  { title: "Christmas", slug: "christmas", parentSlug: "holidays" },
  { title: "New Year", slug: "new-year", parentSlug: "holidays" },
  { title: "Valentine's Day", slug: "valentines-day", parentSlug: "holidays" },
  { title: "Halloween", slug: "halloween", parentSlug: "holidays" },
  { title: "Birthdays", slug: "birthdays", parentSlug: "holidays" },
  { title: "Back to School", slug: "back-to-school", parentSlug: "holidays" },
  { title: "Parties", slug: "parties", parentSlug: "holidays" },

  // 9) Space
  { title: "Space", slug: "space", description: "Out of this world solar system pages", imageUrl: null, parentSlug: null },
  { title: "Planets", slug: "planets", parentSlug: "space" },
  { title: "Stars", slug: "stars", parentSlug: "space" },
  { title: "Rockets", slug: "rockets", parentSlug: "space" },
  { title: "Astronauts", slug: "astronauts", parentSlug: "space" },
  { title: "Moons", slug: "moons", parentSlug: "space" },
  { title: "Galaxies", slug: "galaxies", parentSlug: "space" },
  { title: "Spacecraft", slug: "spacecraft", parentSlug: "space" },
  { title: "Aliens", slug: "aliens", parentSlug: "space" },
  { title: "Space Scenes", slug: "space-scenes", parentSlug: "space" },
  { title: "Solar System", slug: "solar-system", parentSlug: "space" },

  // 10) Education
  { title: "Education", slug: "education", description: "Learn letters, numbers, and shapes", imageUrl: null, parentSlug: null },
  { title: "Letters", slug: "letters", parentSlug: "education" },
  { title: "Numbers", slug: "numbers", parentSlug: "education" },
  { title: "Geometric Shapes", slug: "shapes", parentSlug: "education" },
  { title: "Clock", slug: "clock", parentSlug: "education" },
  { title: "School Tools", slug: "school-tools", parentSlug: "education" },
  { title: "Science", slug: "science", parentSlug: "education" },
  { title: "Maps", slug: "maps", parentSlug: "education" },
  { title: "Educational Coloring", slug: "edu-coloring", parentSlug: "education" },
  { title: "Simple Words", slug: "simple-words", parentSlug: "education" },
  { title: "Exercises", slug: "exercises", parentSlug: "education" },

  // 11) Fantasy
  { title: "Fantasy", slug: "fantasy", description: "Magical creatures and worlds", imageUrl: null, parentSlug: null },
  { title: "Dragons", slug: "dragons", parentSlug: "fantasy" },
  { title: "Unicorns", slug: "unicorns", parentSlug: "fantasy" },
  { title: "Magic", slug: "magic", parentSlug: "fantasy" },
  { title: "Castles", slug: "fantasy-castles", parentSlug: "fantasy" },
  { title: "Mythical Creatures", slug: "mythical-creatures", parentSlug: "fantasy" },
  { title: "Legendary Heroes", slug: "legendary-heroes", parentSlug: "fantasy" },
  { title: "Magical Forests", slug: "magical-forests", parentSlug: "fantasy" },
  { title: "Fantasy Sky", slug: "fantasy-sky", parentSlug: "fantasy" },
  { title: "Magic Books", slug: "magic-books", parentSlug: "fantasy" },
  { title: "Fantasy Worlds", slug: "fantasy-worlds", parentSlug: "fantasy" },

  // 12) Sports
  { title: "Sports", slug: "sports", description: "Athletic activities and events", imageUrl: null, parentSlug: null },
  { title: "Soccer", slug: "soccer", parentSlug: "sports" },
  { title: "Basketball", slug: "basketball", parentSlug: "sports" },
  { title: "Handball", slug: "handball", parentSlug: "sports" },
  { title: "Tennis", slug: "tennis", parentSlug: "sports" },
  { title: "Swimming", slug: "swimming", parentSlug: "sports" },
  { title: "Horse Riding", slug: "horse-riding", parentSlug: "sports" },
  { title: "Running", slug: "running", parentSlug: "sports" },
  { title: "Gymnastics", slug: "gymnastics", parentSlug: "sports" },
  { title: "Bicycles", slug: "sports-bicycles", parentSlug: "sports" },
  { title: "Olympic Games", slug: "olympics", parentSlug: "sports" },

  // 13) Professions
  { title: "Professions", slug: "professions", description: "Learn about different jobs", imageUrl: null, parentSlug: null },
  { title: "Doctor", slug: "doctor", parentSlug: "professions" },
  { title: "Teacher", slug: "teacher", parentSlug: "professions" },
  { title: "Policeman", slug: "policeman", parentSlug: "professions" },
  { title: "Firefighter", slug: "firefighter", parentSlug: "professions" },
  { title: "Engineer", slug: "engineer", parentSlug: "professions" },
  { title: "Cook", slug: "cook", parentSlug: "professions" },
  { title: "Farmer", slug: "farmer", parentSlug: "professions" },
  { title: "Carpenter", slug: "carpenter", parentSlug: "professions" },
  { title: "Mechanic", slug: "mechanic", parentSlug: "professions" },
  { title: "Construction Worker", slug: "construction-worker", parentSlug: "professions" },

  // 14) Daily Objects
  { title: "Daily Objects", slug: "daily-objects", description: "Objects you see everyday", imageUrl: null, parentSlug: null },
  { title: "Furniture", slug: "furniture", parentSlug: "daily-objects" },
  { title: "Household Items", slug: "household-items", parentSlug: "daily-objects" },
  { title: "Clothes", slug: "clothes", parentSlug: "daily-objects" },
  { title: "Shoes", slug: "shoes", parentSlug: "daily-objects" },
  { title: "Bags", slug: "bags", parentSlug: "daily-objects" },
  { title: "Watches", slug: "watches", parentSlug: "daily-objects" },
  { title: "Toys", slug: "toys", parentSlug: "daily-objects" },
  { title: "Books", slug: "books", parentSlug: "daily-objects" },
  { title: "Electronic Devices", slug: "electronics", parentSlug: "daily-objects" },
  { title: "Kitchen Tools", slug: "kitchen-tools", parentSlug: "daily-objects" },

  // 15) Seasons & Weather
  { title: "Seasons", slug: "seasons", description: "Spring, summer, autumn, and winter", imageUrl: null, parentSlug: null },
  { title: "Spring", slug: "spring", parentSlug: "seasons" },
  { title: "Summer", slug: "summer", parentSlug: "seasons" },
  { title: "Autumn", slug: "autumn", parentSlug: "seasons" },
  { title: "Winter", slug: "winter", parentSlug: "seasons" },
  { title: "Rain", slug: "rain", parentSlug: "seasons" },
  { title: "Snow", slug: "snow", parentSlug: "seasons" },
  { title: "Sun", slug: "sun", parentSlug: "seasons" },
  { title: "Sea", slug: "sea-weather", parentSlug: "seasons" },
  { title: "Picnics", slug: "picnics", parentSlug: "seasons" },
  { title: "Camping", slug: "camping", parentSlug: "seasons" },
];

const coloringPages = [
  {
    title: "Brave Lion",
    slug: "brave-lion",
    imageUrl: "/coloring-pages/lion.png",
    thumbnailUrl: "/coloring-pages/lion-thumb.png",
    categorySlug: "animals",
    subCategorySlug: "farm-animals",
    description: "King of the jungle lion coloring page",
    difficulty: "medium",
    ageGroup: "kids",
    views: 120,
    downloads: 45,
    likes: 18,
  },
  {
    title: "Astronaut",
    slug: "astronaut",
    imageUrl: "/coloring-pages/astronaut.png",
    thumbnailUrl: "/coloring-pages/astronaut-thumb.png",
    categorySlug: "space",
    subCategorySlug: null,
    description: "An astronaut floating in the galaxy",
    difficulty: "hard",
    ageGroup: "adults",
    views: 240,
    downloads: 98,
    likes: 42,
  },
  {
    title: "Colorful Parrot",
    slug: "colorful-parrot-bird",
    imageUrl: "/images/Colorful parrot bird.jpg",
    thumbnailUrl: "/images/Colorful parrot bird.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "A beautiful parrot sitting on a branch coloring page.",
    difficulty: "medium",
    ageGroup: "kids",
    views: 1450,
    downloads: 920,
    likes: 410,
  },
  {
    title: "Cute Sparrow",
    slug: "cute-sparrow-bird-branch",
    imageUrl: "/images/Cute sparrow bird branch.jpg",
    thumbnailUrl: "/images/Cute sparrow bird branch.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "A cute little sparrow resting on a tree branch coloring page.",
    difficulty: "easy",
    ageGroup: "preschool",
    views: 980,
    downloads: 610,
    likes: 290,
  },
  {
    title: "European Goldfinch",
    slug: "european-goldfinch-bird",
    imageUrl: "/images/European goldfinch bird.jpg",
    thumbnailUrl: "/images/European goldfinch bird.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "Detailed European goldfinch bird coloring page.",
    difficulty: "hard",
    ageGroup: "adults",
    views: 1120,
    downloads: 730,
    likes: 350,
  },
  {
    title: "Cute Pigeon",
    slug: "cute-pigeon-bird",
    imageUrl: "/images/Cute pigeon bird.jpg",
    thumbnailUrl: "/images/Cute pigeon bird.jpg",
    categorySlug: "animals",
    subCategorySlug: "birds",
    description: "A cute pigeon bird coloring page for kids.",
    difficulty: "easy",
    ageGroup: "toddler",
    views: 870,
    downloads: 540,
    likes: 260,
  },
];

async function main() {
  console.log("Cleaning database...");
  await prisma.pageView.deleteMany({});
  await prisma.coloringPage.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.adminUser.deleteMany({});

  console.log("Seeding categories...");
  
  // 1. Seed Parent Categories First
  const parentCats = categories.filter(c => c.parentSlug === null);
  for (const cat of parentCats) {
    await prisma.category.create({
      data: {
        title: cat.title,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: 0,
      }
    });
  }

  // 2. Seed Child Categories Next
  const childCats = categories.filter(c => c.parentSlug !== null);
  for (const cat of childCats) {
    await prisma.category.create({
      data: {
        title: cat.title,
        slug: cat.slug,
        parentSlug: cat.parentSlug,
        sortOrder: 0,
      }
    });
  }

  console.log("Seeding coloring pages...");
  for (const page of coloringPages) {
    await prisma.coloringPage.create({
      data: {
        title: page.title,
        slug: page.slug,
        imageUrl: page.imageUrl,
        thumbnailUrl: page.thumbnailUrl,
        categorySlug: page.categorySlug,
        subCategorySlug: page.subCategorySlug,
        description: page.description,
        difficulty: page.difficulty,
        ageGroup: page.ageGroup,
        views: page.views,
        downloads: page.downloads,
        likes: page.likes,
        published: true,
      }
    });
  }

  console.log("Seeding admin user...");
  const adminEmail = "admin@kolorpaper.com";
  // WARNING: This seed file is strictly for development and testing environments.
  // DO NOT use this password in production. Change it immediately after setup.
  const passwordHash = await bcrypt.hash("KP-SecureAdmin-2026!#", 10);
  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: "KolorPaper Admin",
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
