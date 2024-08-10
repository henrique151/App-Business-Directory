import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./../../configs/FirebaseConfig";
import { Colors } from "./../../constants/Colors";
import CategoryItem from "./CategoryItem";
import { useRouter } from "expo-router";

export default function Category({ explore = false, onCategorySelect }) {
  const [categoryList, setCategoryList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetCategoryList();
  }, []); // Use an empty array to run this effect only once

  const GetCategoryList = async () => {
    setCategoryList([]);
    const q = query(collection(db, "Category"));
    const querySnapshot = await getDocs(q);

    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    setCategoryList(categories);
  };

const onCategoryPressHandler=(item)=> {
    if(!explore) {
      router.push("/businesslist/" + item.name)
    } else {
      onCategorySelect(item.name)
    }
   }

  return (
    <View>
      {!explore && (
        <View
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "outfit-bold",
            }}
          >
            Category
          </Text>
          <Text style={{ color: Colors.PRIMARY, fontFamily: "outfit-medium" }}>
            View All
          </Text>
        </View>
      )}
      <FlatList
        data={categoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginLeft: 20 }}
        renderItem={({ item, index }) => (
          <CategoryItem
            category={item}
            key={index}
            onCategoryPress={(category) =>
              onCategoryPressHandler(item)}
          />
        )}
      />
    </View>
  );
}
