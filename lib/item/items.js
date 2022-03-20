import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';
export const itemFields = [
	'country',
	'city',
	'description',
	'imageUrl',
	'location',
	'name',
	'nameUrl',
	'rating',
	'state',
	'source',
	'sourceUrl',
	'subType',
	'tags',
	'type',
];

// Pull only the whitelisted properties from the body parameters
const retrieveValidItemFields = (params) => {
	return itemFields.reduce((item, field) => {
		item[field] = params[field];
		return item;
	}, {});
  };

const getItemCollection = async () => {
	const {db} = await connectToDatabase();
	return db.collection('items');
}

export async function getItem(itemId) {
	const itemCollection = await getItemCollection();
	const itemIdObject = new ObjectId(itemId);
	const dbResult = await itemCollection.findOne({_id: itemIdObject});
	// console.log("Found this:", dbResult);
	return dbResult;
};

export async function getItems(itemType) {
	// console.log({itemType});
	const filter = itemType ? {type: itemType} : null;
	const itemCollection = await getItemCollection();
	const items = await itemCollection.find(filter).toArray();
	items.forEach(item => item._id = item._id.toString());
	console.log("items is", items);

	return items;
}

export async function addItem({itemFields}) {
	// console.log({itemType});
	const validItemFields = retrieveValidItemFields(itemFields)
	const itemCollection = await getItemCollection();
	const result = await itemCollection.insertOne(validItemFields);
	console.log("result of insert is", result);
}

export async function updateItem({itemFields, itemId}) {
	const validItemFields = retrieveValidItemFields(itemFields)
	console.log("updating with fields:", validItemFields);
	const itemCollection = await getItemCollection();
	const itemIdObject = new ObjectId(itemId);
	console.log({itemFields});
	const dbResult = await itemCollection.updateOne(
	  {_id: itemIdObject},
	  {$set: validItemFields}
	);
	console.log("updated this...", dbResult);
  };
  