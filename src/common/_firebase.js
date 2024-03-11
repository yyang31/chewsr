import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    Query,
    DocumentReference,
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

const add = async (payload) => {
    return await addDoc(col, payload);
};

const addPlaceGroup = async (groupCode, placesRequest) => {
    let now = new Date();
    let docRef = await add({
        groupCode: groupCode,
        placesRequest: placesRequest,
        expirationDate: new Date(now.setDate(now.getDate() + 7)), // set expiration date to 7 days from creation
    });

    return {
        error: null,
        id: docRef.id,
        data: placesRequest,
    };
};

const update = async (docRef, payload) => {
    await updateDoc(docRef, payload);
};

const updatePlaceGroupLikes = async (groupCode, placeId) => {
    // let docRef = doc(
    //     db,
    //     process.env.REACT_APP_COLLECTION_NAME,
    //     auth.currentUser.uid
    // );
};

const get = async (query) => {
    let docsResult = await getDocs(query);
    return docsResult.docs;
};

const getPlaceGroupByGroupCode = async (groupCode) => {
    let q = query(col, where("groupCode", "==", groupCode));
    let docResult = await get(q);

    let errorMsg = null;
    if (docResult.length == 0) {
        errorMsg = `groupCode of ${groupCode} can not be found.`;
    }

    return {
        error: errorMsg,
        id: docResult[0].id,
        data: docResult[0].data(),
    };
};

export { addPlaceGroup, getPlaceGroupByGroupCode };
