import { db } from '@/db';
import { users } from '@/db/schema';

const categoryList = [
  {
    name: 'Cars and vehicles',
    description:
      'Content related to automobiles, reviews, driving, and transportation.',
  },
  {
    name: 'Music',
    description:
      'Music videos, performances, playlists, covers, and artist content.',
  },
  {
    name: 'Gaming',
    description: 'Gameplays, reviews, livestreams, and gaming news.',
  },
  {
    name: 'News and politics',
    description: 'Current events, political commentary, and news coverage.',
  },
  {
    name: 'Sports',
    description: 'Sports highlights, commentary, and fitness-related content.',
  },
  {
    name: 'Education',
    description:
      'Informative videos, tutorials, and academic learning materials.',
  },
  {
    name: 'Science and technology',
    description:
      'Tech reviews, science experiments, discoveries, and innovations.',
  },
  {
    name: 'Travel and events',
    description: 'Travel vlogs, event coverage, and destination guides.',
  },
  {
    name: 'People and blogs',
    description: 'Personal vlogs, life stories, and lifestyle content.',
  },
  {
    name: 'Entertainment',
    description: 'Celebrity news, variety shows, and entertainment media.',
  },
  {
    name: 'How-to and style',
    description: 'DIY tutorials, fashion advice, and style inspiration.',
  },
  {
    name: 'Comedy',
    description: 'Funny skits, parodies, and stand-up comedy videos.',
  },
  {
    name: 'Film and animation',
    description: 'Short films, animations, and movie-related content.',
  },
  {
    name: 'Pets and animals',
    description: 'Videos of pets, wildlife, animal care, and behavior.',
  },
  {
    name: 'Nonprofits and activism',
    description: 'Awareness campaigns, charity work, and activist content.',
  },
  {
    name: 'History and facts',
    description: 'Historical documentaries, trivia, and educational facts.',
  },
];

async function main() {
  console.log('Seeding categories...');

  try {
    // await db.insert(categories).values(categoryList);
    await db.insert(users).values([
      {
        clerkId: 'clerk_test_user',
        name: 'Test User',
        imageUrl: 'https://example.com/test-user.jpg',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Categories seeded successfully.');
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

main();
