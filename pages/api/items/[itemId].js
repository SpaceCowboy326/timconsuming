// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getItem, updateItem } from '../../../lib/item/items';

export default async (req, res) => {
    const {itemId} = req.query;
    let result;
    switch (req.method) {
      case 'PUT':
        const itemFields = JSON.parse(req.body);
        const updateResult = updateItem({itemFields, itemId});
        result = {success: 1};
        break;
      case 'GET':
        result = getItem({itemId});
        break;
      default:
        console.error(`Invalid method "${req.method}" for [itemId] API endpoint.`);
        //TODO - send error immediately?
        break;
    }

    console.log("ITEM result", result);
    res.status(200).json({ name: 'John Doe' })
}
