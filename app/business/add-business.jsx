import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs, query, setDoc, doc } from "firebase/firestore";
import { db, storage } from "./../../configs/FirebaseConfig";
import RNPickerSelect from "react-native-picker-select";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

export default function AddBusiness() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const { user } = useUser();
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [contact, setContact] = useState();
  const [website, setWebsite] = useState();
  const [about, setAbout] = useState();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Business",
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.PRIMARY,
      },
       headerTintColor: '#FFFFFF'
    });
    GetCategoryList();
  }, []);

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      quality: 1,
    });
    setImage(result?.assets[0].uri);
    console.log(result);
  };

  const GetCategoryList = async () => {
    setCategoryList([]); // Isso faz que não duplicar os dados extridos do banco de dados.
    const q = query(collection(db, "Category"));
    const snapShot = await getDocs(q);

    snapShot.forEach((doc) => {
      console.log(doc.data());
      setCategoryList((prev) => [
        ...prev,
        {
          label: doc.data().name,
          value: doc.data().name,
        },
      ]);
    });
  };

  const onAddNewBusiness = async () => {
    setLoading(true);
    const fileName = Date.now().toString() + ".jpg";
    const resp = await fetch(image);
    const blob = await resp.blob();

    const imageRef = ref(storage, "business-app/" + fileName);

    uploadBytes(imageRef, blob)
      .then((snapshot) => {
        console.log("File Uploaded...");
      })
      .then((resp) => {
        getDownloadURL(imageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          saveBusinessDetail(downloadUrl);
        });
      });
    setLoading(false);
  };

  const saveBusinessDetail = async (imageUrl) => {
    console.log("Saving business detail with category:", category); // Log para verificar o valor de category
    await setDoc(doc(db, "BusinessList", Date.now().toString()), {
      name: name,
      address: address,
      contact: contact,
      about: about,
      website: website,
      category: category, // Certifique-se de que isso está capturando o valor correto
      username: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      imageUrl: imageUrl,
    });
    setLoading(false);
    ToastAndroid.show("New Business Added...", ToastAndroid.LONG);
  };

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
        }}
      >
        Add New Business
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          color: Colors.GRAY,
        }}
      >
        Fill all details in order te add new bussiness.
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
        }}
        onPress={() => onImagePick()}
      >
        {!image ? (
          <Image
            source={require("./../../assets/images/placeholder.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
            }}
          />
        )}
      </TouchableOpacity>

      <View>
        <TextInput
          placeholder="Name"
          onChangeText={(v) => setName(v)}
          style={styles.inputText}
        />
        <TextInput
          placeholder="Address"
          onChangeText={(v) => setAddress(v)}
          style={styles.inputText}
        />
        <TextInput
          placeholder="Contact"
          onChangeText={(v) => setContact(v)}
          style={styles.inputText}
        />
        <TextInput
          placeholder="Website"
          onChangeText={(v) => setWebsite(v)}
          style={styles.inputText}
        />
        <TextInput
          multiline
          numberOfLines={5}
          placeholder="About"
          onChangeText={(v) => setAbout(v)}
          style={styles.inputAbout}
        />
        <View
          style={{
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "#Fff",
            marginTop: 10,
            borderColor: Colors.PRIMARY,
          }}
        >
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={categoryList}
          />
        </View>
      </View>

      <TouchableOpacity
      disabled={loading}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={() => onAddNewBusiness()}
      >
        {loading ? (
          <ActivityIndicator size={'large'} color={'#FFF'} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              color: "#fff",
            }}
          >
            Add New Business
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  inputText: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: "#Fff",
    marginTop: 10,
    borderColor: Colors.PRIMARY,
    fontFamily: "outfit",
  },
  inputAbout: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: "#Fff",
    marginTop: 10,
    borderColor: Colors.PRIMARY,
    fontFamily: "outfit",
    height: 100,
  }
});