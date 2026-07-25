import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MenuItem } from './models/MenuItem';

let mongoServer: MongoMemoryServer | null = null;

export async function connectDB() {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('No MONGODB_URI found. Initializing MongoMemoryServer...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${uri}`);
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('MongoDB connected successfully!');
    }

    await seedDatabase();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

export async function seedDatabase() {
  try {
    const count = await MenuItem.countDocuments();
    if (count < 14) {
      console.log('Seeding menu items into MongoDB...');
      await MenuItem.deleteMany({});

      const menuItems = [
        {
          name: 'Pizza Margherita',
          description: 'Classic Neapolitan pizza with fresh tomato sauce, creamy mozzarella, rich olive oil, and fresh garden basil.',
          price: 450,
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
          taste: 'savory'
        },
        {
          name: 'Lasagna alla Bolognese',
          description: 'Traditional Italian lasagna layered with rich slow-cooked beef ragù, creamy bechamel, and melted Parmesan crust.',
          price: 500,
          image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=80',
          taste: 'savory'
        },
        {
          name: 'Pasta Carbonara',
          description: 'Al dente spaghetti tossed with crispy cured guanciale, pasture egg yolks, black pepper, and Pecorino Romano cheese.',
          price: 400,
          image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=80',
          taste: 'savory'
        },
        {
          name: 'Tiramisu',
          description: 'Rich Italian dessert of espresso-soaked ladyfingers, velvety mascarpone cream, and dark cocoa dust.',
          price: 200,
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80',
          taste: 'sweet'
        },
        {
          name: 'Focaccia Bread',
          description: 'Oven-baked flatbread with a golden, crispy skin of olive oil, topped with rosemary sprigs and sea salt flakes.',
          price: 350,
          image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=800&auto=format&fit=crop&q=80',
          taste: 'savory'
        },
        {
          name: 'Bruschetta',
          description: 'Garlic-rubbed toasted rustic sourdough topped with diced vine-ripened tomatoes, extra virgin olive oil, and fresh basil.',
          price: 600,
          image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=800&auto=format&fit=crop&q=80',
          taste: 'savory'
        },
        {
          name: 'Mushroom Risotto',
          description: 'Arborio rice slowly simmered in earthy wild mushroom reduction, dry white wine, butter, and freshly grated Parmesan.',
          price: 650,
          image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80',
          taste: 'savory'
        },
        {
          name: 'Strawberry Panna Cotta',
          description: 'Silky, chilled premium Italian cream dessert, accompanied by a bright and zesty fresh strawberry coulis.',
          price: 250,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
          taste: 'sweet'
        },
        {
          name: 'Diavola Pizza',
          description: 'Fiery wood-fired pizza topped with spicy Calabrian salami, red pepper flakes, organic tomato sauce, and mozzarella.',
          price: 490,
          image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80',
          taste: 'spicy'
        },
        {
          name: 'Spaghetti all\'Arrabbiata',
          description: 'Traditional sharp Roman pasta sautéed in a fiery sauce of fresh garlic, crushed tomatoes, and red chili peppers.',
          price: 380,
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
          taste: 'spicy'
        },
        {
          name: 'Sicilian Cannoli',
          description: 'Crispy custom tubular pastry shells stuffed with sweet, creamy sheep\'s milk ricotta and candied orange peels.',
          price: 220,
          image: 'https://images.unsplash.com/photo-1599785209796-7c64b399c50e?w=800&auto=format&fit=crop&q=80',
          taste: 'sweet'
        },
        {
          name: 'Espresso Affogato',
          description: 'Warm, intense double shot of premium bitter espresso poured over a smooth scoop of cold vanilla bean gelato.',
          price: 180,
          image: 'https://images.unsplash.com/photo-1594911774802-8822a7079af1?w=800&auto=format&fit=crop&q=80',
          taste: 'bitter'
        },
        {
          name: 'Campari Glazed Artichokes',
          description: 'Crisp Roman artichokes pan-fried in garlic olive oil and glazed with a bitter, botanical Campari syrup.',
          price: 420,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
          taste: 'bitter'
        },
        {
          name: 'Sorbetto al Limone',
          description: 'Sharp, sour, and immensely refreshing lemon water ice churned with artisanal Amalfi coast limoncello.',
          price: 190,
          image: 'https://images.unsplash.com/photo-1517093157656-b9ecdf97cb18?w=800&auto=format&fit=crop&q=80',
          taste: 'sour'
        },
        {
          name: 'Pasta al Limone',
          description: 'Zesty and sour culinary masterpiece of fresh home-made pasta tossed in Amalfi lemon juice extract and Pecorino.',
          price: 390,
          image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&auto=format&fit=crop&q=80',
          taste: 'sour'
        },
        {
          name: 'Sweet Nutella Calzone',
          description: 'Warm folded dessert bread stuffed with melted Nutella hazelnut cream, served with a dusting of confectioner\'s sugar.',
          price: 280,
          image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&auto=format&fit=crop&q=80',
          taste: 'sweet'
        }
      ];

      await MenuItem.insertMany(menuItems);
      console.log('MongoDB menu database seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}
