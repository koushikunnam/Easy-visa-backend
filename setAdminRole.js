const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // already in your project?

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "Epqx9TSdjYeN6y7pQ0q8X0dorFm1"; // 🔁 Get from Firebase Console > Auth > Users

admin.auth().setCustomUserClaims(uid, { role: "admin" })
  .then(() => {
    console.log("Admin role assigned to user!");
  })
  .catch(err => {
    console.error("Error assigning role:", err);
  });
