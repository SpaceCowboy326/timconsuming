// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '../../../lib/mongodb'


const handleUniqueTagsRequest = async (req, res) => {
    if (req.method === 'GET') {
        const {client, db} = await connectToDatabase();
        const collection = db.collection('items')
        const {itemType} = req.query;

        if (!itemType) {
            res.status(400).json({error: "No itemType specified."})
            return;
        }
        const result = await collection.distinct('tags', {type: itemType});
        res.status(200).json(result)
    } else {
      // Handle any other HTTP method
    }
};

export default handleUniqueTagsRequest;