import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import BusinessListCard from "./BusinessListCard";

export default function ExploreBusinessList({ businessList }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false} 
    >
      <FlatList
        data={businessList}
        scrollEnabled
        renderItem={({ item, index }) => (
          <BusinessListCard key={index} business={item} />
        )}
        contentContainerStyle={{ paddingBottom: 200 }} // Space for extra content or footer
      />
    </ScrollView>
  );
}
