import { connectToDatabase } from '../mongodb';


export async function getItems(itemType) {
	const {client, db} = await connectToDatabase();
	const collection = db.collection('items');
	const items = await collection.find({type: itemType}).toArray();
	return items;
}
