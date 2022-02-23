// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { connectToDatabase } from '../../lib/mongodb'

import {getItems} from '../../lib/item/items';

export default async (req, res) => {
    if (req.method === 'GET') {
        const {itemType} = req.query;
        if (!itemType) {
            res.status(400).json({error: "No itemType specified."})
            return;
        }

        const items = await getItems(itemType);
        console.log("Insert result", items);
        res.status(200).json(items)
    } else {
      // Handle any other HTTP method
    }
}
