// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { connectToDatabase } from '../../lib/mongodb'

import {getItems, addItem} from '../../lib/item/items';




export default async (req, res) => {

    switch (req.method) {
        case 'GET':
            const {itemType} = req.query;
            if (!itemType) {
                res.status(400).json({error: "No itemType specified."})
                return;
            }
            const items = await getItems(itemType);
            res.status(200).json(items)
            break;
        case 'POST':
            const itemFields = JSON.parse(req.body);
            addItem({itemFields})
            break;
        default:
            console.error(`Invalid method "${req.method}" for items API endpoint.`);
            //TODO - send error immediately?
            break;
    }
    res.status(200).json({ name: 'John Doe' })
}
