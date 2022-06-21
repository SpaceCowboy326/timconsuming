import {getItems, addItem} from '../../lib/item/items';

const handleItems = async (req, res) => {
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
            break;
    }
    res.status(200).json({ name: 'John Doe' })
};

export default handleItems;
