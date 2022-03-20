import formidable from 'formidable';

export default async function handler(req, res) {
    const tempResponse = {message: "awesome job"};
    return res.status(200).json(tempResponse);
}

export const config = {
    api: {
      bodyParser: false
    }
};