import formidable from 'formidable';

export default async function handler(req, res) {
    // console.log("req", req);
    const callback = (data) => {
        console.log("file data", data);
    };
    if (req.method === 'POST') {
        const form = formidable({
          filename: (name, ext, part, form) => {
            return `test_${part.originalFilename}`;
          },
          uploadDir: `${__dirname}/../../../../../public/images/items`,
        });
        form.keepExtensions = true;

        const parsePromise = new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              console.log("ERR IS", err);
              reject(err);
            }
            resolve({fields, files});
          });
        });

        return parsePromise.then(({fields, files}) => {
          console.log("FIELDS", fields);
          console.log("FILES", files);
          const file = files.file;
          const newFilename = file.newFilename;

          // const newFilename = files?.file?.newFilename;
          console.log("NEW FILE NAME", newFilename);
          res.status(200).json(JSON.stringify({newFilename}));
        });
    } else {
      // Handle any other HTTP method
    }
}

export const config = {
    api: {
      bodyParser: false
    }
};