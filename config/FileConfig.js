const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const apikeys = require("./apikey.json");
const SCOPE = ["https://www.googleapis.com/auth/drive"];

// A Function that can provide access to Google Drive API
async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();
  return jwtClient;
}

// A Function that will upload the desired file to Google Drive folder
async function uploadFile(authClient, filePath) {
  return new Promise((resolve, rejected) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    var fileMetaData = {
      name: path.basename(filePath), // Lấy tên file từ đường dẫn
      parents: ["11gBphhVzwCGa5RC-pg8dqSFpz14z9YiR"], // Thay bằng folder ID thực tế
    };

    drive.files.create(
      {
        resource: fileMetaData,
        media: {
          body: fs.createReadStream(filePath), // Tệp sẽ được tải lên
          // mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // MIME type
        },
        fields: "id",
      },
      function (error, file) {
        if (error) {
          return rejected(error);
        }

        // Thay đổi quyền truy cập của tệp
        setFilePermission(drive, file.data.id)
          .then(() => resolve(file))
          .catch(rejected);
      }
    );
  });
}

// Thay đổi quyền truy cập của tệp
async function setFilePermission(drive, fileId) {
  return new Promise((resolve, reject) => {
    drive.permissions.create(
      {
        fileId: fileId,
        resource: {
          type: "anyone",
          role: "reader", // Quyền đọc cho bất kỳ ai
        },
      },
      function (error, permission) {
        if (error) {
          return reject(error);
        }
        resolve(permission);
      }
    );
  });
}

// Export các hàm để dùng ở nơi khác
module.exports = {
  authorize,
  uploadFile,
};
