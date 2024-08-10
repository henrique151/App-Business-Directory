import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./../../configs/FirebaseConfig";
import BusinessListCard from "../../components/Explore/BusinessListCard";
import { useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function MyBusiness() {
  const { user } = useUser();
  const [buninessList, setBuninessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'My Business',
      headerStyle: {
        backgroundColor: Colors.PRIMARY,
      },
       headerTintColor: '#FFFFFF'
    });
    user && GetUserBusiness();
  }, [user]);

    /* 
    * Used to get business list by user email
    */

  const GetUserBusiness = async () => {
    setLoading(true);
    setBuninessList([]);
    const q = query(
      collection(db, "BusinessList"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnaphpt = await getDocs(q);
    querySnaphpt.forEach((doc) => {
      console.log(doc.data());
      setBuninessList(prev=>[...prev,{id:doc.id,...doc.data()}])
    });
    setLoading(false);
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
          fontSize: 30,
        }}
      >
        My Business
      </Text>

      <FlatList
        data={buninessList}
        onRefresh={GetUserBusiness}
        refreshing={loading}
        renderItem={({item, index})=> (
            <BusinessListCard 
                business={item}  
                key={index}
            />
        )}
      />
    </View>
  );
}
