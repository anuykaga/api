
import firebase from 'firebase/app';
npm install firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Importing Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Menambahkan Data
async function addUser() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: "John Doe",
            email: "john.doe@example.com"
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Membaca Data
async function getUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
}

// Mengupdate Data
async function updateUser(userId) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        email: "new.email@example.com"
    });
    console.log("Document successfully updated!");
}

// Menghapus Data
async function deleteUser(userId) {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    console.log("Document successfully deleted!");
}

// Panggil fungsi sesuai kebutuhan
addUser();
getUsers();
// updateUser("USER_ID"); // Ganti USER_ID dengan ID yang sesuai
// deleteUser("USER_ID"); // Ganti USER_ID dengan ID yang sesuai


### 4. **Menggunakan Cloud Firestore**
const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };

   // Initialize Firebase
   const app = firebase.initializeApp(firebaseConfig);
   const db = firebase.firestore();
#### Menambahkan Data

db.collection("users").add({
    name: "John Doe",
    email: "john.doe@example.com"
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
```

#### Membaca Data


db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
});


#### Mengupdate Data


const userRef = db.collection("users").doc("USER_ID");
userRef.update({
    email: "new.email@example.com"
})
.then(() => {
    console.log("Document successfully updated!");
})
.catch((error) => {
    console.error("Error updating document: ", error);
});


#### Menghapus Data


const userRef = db.collection("users").doc("USER_ID");
userRef.delete().then(() => {
    console.log("Document successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi untuk mengimpor data dari file JSON
async function importDataFromJSON(filePath) {
    try {
        // Baca file JSON
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Simpan data pengguna
        for (const user of data.users) {
            await addDoc(collection(db, "users"), user);
            console.log(`User added: ${JSON.stringify(user)}`);
        }

        // Simpan data kunci (jika diperlukan)
        for (const key of data.keys) {
            await addDoc(collection(db, "keys"), { key });
            console.log(`Key added: ${key}`);
        }
    } catch (error) {
        console.error("Error importing data: ", error);
    }
}

// Jalankan fungsi impor
importDataFromJSON('path/to/database.json');
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi untuk mengambil data
async function fetchData() {
    try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const keysSnapshot = await getDocs(collection(db, "keys"));

        // Susun data pengguna
        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id, // Menyimpan ID dokumen
            ...doc.data() // Menyimpan data dokumen
        }));

        // Susun data kunci
        const keys = keysSnapshot.docs.map(doc => doc.data().key); // Asumsikan `key` adalah field dalam dokumen

        // Format akhir
        const result = {
            users: users,
            keys: keys
        };

        console.log(JSON.stringify(result, null, 2)); // Menampilkan hasil
        return result;

    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

// Jalankan fungsi untuk mengambil data
fetchData();
