const handleAddImageRequest = async function handler(req, res) {
    const tempResponse = {message: "awesome job"};
    res.status(200).json(tempResponse);
}

export const config = {
    api: {
      bodyParser: false
    }
};

export default handleAddImageRequest;