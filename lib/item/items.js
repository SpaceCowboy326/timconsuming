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
	return dbResult;
};

export async function getItems(itemType) {
	const filter = itemType ? {type: itemType} : null;
	const itemCollection = await getItemCollection();
	const items = await itemCollection.find(filter).toArray();
	items.forEach(item => item._id = item._id.toString());

	return items;
}

export async function addItem({itemFields}) {
	const validItemFields = retrieveValidItemFields(itemFields)
	const itemCollection = await getItemCollection();
	const result = await itemCollection.insertOne(validItemFields);
}

export async function updateItem({itemFields, itemId}) {
	const validItemFields = retrieveValidItemFields(itemFields)
	const itemCollection = await getItemCollection();
	const itemIdObject = new ObjectId(itemId);
	const dbResult = await itemCollection.updateOne(
	  {_id: itemIdObject},
	  {$set: validItemFields}
	);
  };
  