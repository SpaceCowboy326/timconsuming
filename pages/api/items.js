// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '../../lib/mongodb'

const itemFields = [
  'location',
  'name',
  'source',
  'tags',
  'type',
  'imageUrl',
];

export default async (req, res) => {
    if (req.method === 'GET') {
        const {itemType} = req.query;
        if (!itemType) {
            res.status(400).json({error: "No itemType specified."})
            return;
        }

        const {client, db} = await connectToDatabase();
        const collection = db.collection('items');
        const items = await collection.find({type: itemType}).toArray();
        console.log("Insert result", items);
        res.status(200).json(items)
    } else {
      // Handle any other HTTP method
    }
}
