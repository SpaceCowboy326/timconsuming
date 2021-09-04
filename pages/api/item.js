// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '../lib/mongodb'


export default function handler(req, res) {
    if (req.method === 'POST') {
        const {client, db} = await connectToDatabase();
        const collection = db.collection('items');
        const item = JSON.parse(req.body);
        const result = await collection.insertOne(item);
        res.status(200).json({ name: 'John Doe' })
    } else {
      // Handle any other HTTP method
    }
}

export default (req, res) => {
    
}
