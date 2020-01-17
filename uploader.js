const AWS = require('aws-sdk')
const fs = require('fs')

const uploadFile = (filePath, fileName) => {
  const fileBuffer = fs.readFileSync(filePath)

  s3.putObject(
    {
      ACL: 'public-read',
      Bucket: 'blaadje-todo-list-app',
      Key: fileName,
      Body: fileBuffer,
    },
    error => {
      if (error) {
        console.error(error)
        return
      }

      console.log(`Uploaded file ${fileName}`)
    },
  )
}

const getFilesNameList = path => {
  const filesFound = fs.readdirSync(path)

  return filesFound.reduce((acc, file) => {
    if (!fs.lstatSync(`${path}/${file}`).isFile()) {
      return acc
    }

    return [...acc, file]
  }, [])
}

AWS.config.update({
  accessKeyId: 'AKIAIOGZO5GVMFD22MRQ',
  secretAccessKey: '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',
})

const s3 = new AWS.S3()

const CODE_PATH = './public'
const fileList = getFilesNameList(CODE_PATH)

fileList.forEach(entry => uploadFile(`${CODE_PATH}/${entry}`, entry))
