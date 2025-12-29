import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { 
  FadeInLeft, 
  Layout, 
  ZoomIn 
} from "react-native-reanimated";

type Props = {
  multipliers: string[]; // The raw list of strings from GameContext
};

// Define our internal object structure so we can have unique IDs
type HistoryItem = {
  id: string;
  value: string;
};

const getRandomMultiplier = () => (1 + Math.random() * 9).toFixed(2);

const MultipliersBar: React.FC<Props> = ({ multipliers }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Internal state that holds BOTH fake history + real history with IDs
  const [items, setItems] = useState<HistoryItem[]>([]);
  
  // Track the previous length to know when a NEW item arrived
  const prevCountRef = useRef(0);

  // 1. ON MOUNT: Generate Fake History
  useEffect(() => {
    const fakeData: HistoryItem[] = [];
    let lastVal = 1.00;
    
    for (let i = 0; i < 20; i++) {
      let val = parseFloat(getRandomMultiplier());
      // Logic to prevent too many small numbers in a row
      if (i > 0 && lastVal < 1.5 && val < 1.5) {
        val = 1.5 + Math.random() * 1.5;
      }
      lastVal = val;
      
      fakeData.push({
        id: `fake-${i}`, // Stable ID for fake items
        value: val.toFixed(2),
      });
    }
    setItems(fakeData);
  }, []);

  // 2. SYNC: Watch for new items from GameContext
  useEffect(() => {
    // If we have more multipliers than before, a crash just happened
    if (multipliers.length > prevCountRef.current) {
      const newMultiplierValue = multipliers[0]; // The newest one is at index 0
      
      const newItem: HistoryItem = {
        id: `real-${Date.now()}`, // Unique ID based on time
        value: newMultiplierValue,
      };

      setItems((prev) => [newItem, ...prev]); // Add to start (Triggers Animation)
    }
    
    // Update ref for next comparison
    prevCountRef.current = multipliers.length;
  }, [multipliers]);


  const getColor = (num: number) => {
    if (num > 10) return "#a72187ff"; // Pink
    if (num > 2) return "#7b31e4ff";  // Purple
    return "#3aa7e2ff";               // Blue
  };

  // Only show first 15 in the top bar
  const topBarItems = items.slice(0, 15);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.multipliersRow}
        >
          {/* 
             REANIMATED MAGIC: 
             We map over our internal items. 
             Because they have unique IDs, Reanimated knows exactly which one is new.
          */}
          {topBarItems.map((item, index) => {
            const num = parseFloat(item.value);
            return (
              <Animated.View
                key={item.id} // <--- CRITICAL: Must be unique for animation to work
                entering={FadeInLeft.duration(400)} // The "Step 1: Fade In"
                layout={Layout.springify().damping(14)} // The "Step 2: Slide Others"
                style={styles.pillContainer}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      color: getColor(num),
                      opacity: index > 10 ? 0.5 : 1,
                    },
                  ]}
                >
                  {num.toFixed(2)}x
                </Text>
              </Animated.View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setShowModal(true)}
        >
          <Icon name="more-horiz" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MODAL (No animation needed here usually, just a grid) */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Round History</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.moreBtn}>
                <Icon name="close" size={19} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.grid}>
                {items.slice(0, 50).map((item) => {
                  const num = parseFloat(item.value);
                  return (
                    <Text
                      key={item.id}
                      style={[styles.tableCell, { color: getColor(num) }]}
                    >
                      {num.toFixed(2)}x
                    </Text>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingRight: 15,
    borderRadius: 6,
  },
  multipliersRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    overflow: 'hidden', // Keeps animation clean
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pillContainer: {
    marginRight: 10, // Spacing handled by the view, not the text
  },
  text: {
    fontSize: 12,
    fontFamily: "Slabo13px-Regular",
    fontWeight: 'bold',
  },
  moreBtn: {
    width: 32,
    height: 20,
    borderRadius: 16,
    backgroundColor: "#3b3b3bff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: "#fff" 
  },
  tableCell: {
    fontSize: 14,
    paddingVertical: 8,
    width: '20%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MultipliersBar;