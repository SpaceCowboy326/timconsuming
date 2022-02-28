import { connectToDatabase } from '../mongodb';


export async function getItems(itemType) {
	const {client, db} = await connectToDatabase();
	const collection = db.collection('items');
	console.log("Collection is", collection);
	// const items = await collection.find({type: itemType}).toArray();
	const items = await collection.find({}).toArray();
	items.forEach(item => item._id = item._id.toString());
	console.log("items is", items);

	return items;
}
