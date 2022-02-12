// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '../../lib/mongodb'

const itemFields = [
  'country',
  'city',
  'imageUrl',
  'location',
  'name',
  'rating',
  'state',
  'source',
  'subType',
  'tags',
  'type',
];

export default async (req, res) => {
    if (req.method === 'POST') {
        const {client, db} = await connectToDatabase();
        const collection = db.collection('items');
        const jsonBodyParams = JSON.parse(req.body);

        // Pull only the whitelisted properties from the body parameters
        const newItem = itemFields.reduce((item, field) => {
          item[field] = jsonBodyParams[field];
          return item;
        }, {});
        

        const result = await collection.insertOne(newItem);
        console.log("Insert result", result);
        res.status(200).json({ name: 'John Doe' })
    } else {
      // Handle any other HTTP method
    }
}
