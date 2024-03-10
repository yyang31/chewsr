import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    query,
    where,
    Query,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "chewsr-1579815244098.firebaseapp.com",
    databaseURL: "https://chewsr-1579815244098.firebaseio.com",
    projectId: "chewsr-1579815244098",
    storageBucket: "chewsr-1579815244098.appspot.com",
    messagingSenderId: "11757405982",
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const col = collection(db, process.env.REACT_APP_COLLECTION_NAME);

const upsert = async (payload) => {
    await addDoc(col, payload);
};

const upsertPlaceGroup = (groupCode, placesRequest) => {
    let now = new Date();

    upsert({
        groupCode: groupCode,
        placesRequest: placesRequest,
        expirationDate: new Date(now.setDate(now.getDate() + 7)), // set expiration date to 7 days from creation
    });
};

const get = async (query) => {
    return (await getDocs(query)).docs.map((doc) => doc.data());
};

const getPlaceGroupByGroupCode = async (groupCode) => {
    let q = query(col, where("groupCode", "==", groupCode));
    let result = await get(q);

    return result[0];
};

export { upsertPlaceGroup, getPlaceGroupByGroupCode };
