import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  multipliers: string[];
};

// Helper to generate a single random multiplier string.
const getRandomMultiplier = () => (1 + Math.random() * 9).toFixed(2);

const MultipliersBar: React.FC<Props> = ({ multipliers }) => {
  const [showModal, setShowModal] = useState(false);
  const generateInitialHistory = () => {
    const history: string[] = [];
    for (let i = 0; i < 15; i++) {
      let val = parseFloat(getRandomMultiplier());
      // Ensure we don't get too many 1x in a row
      if (i > 0 && parseFloat(history[i - 1]) < 1.5 && val < 1.5) {
        val = 1.5 + Math.random() * 1.5; // push slightly higher
      }
      history.push(val.toFixed(2));
    }
    return history;
  };

  const [initialHistory] = useState(generateInitialHistory);



  const getColor = (num: number) => {
    if (num > 10) return "#9D1F80"; // Pink
    if (num > 2) return "#7B31E0";  // Purple
    return "#369CD4";               // Blue
  };

  // Use real multipliers if they exist, otherwise use our stable initial placeholders.
  const displayHistory = multipliers.length > 0 ? multipliers : initialHistory;
  const latestMultipliers = displayHistory.slice(0, 9);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.multipliersRow}
        >
          {latestMultipliers.map((value, index) => {
            const num = parseFloat(value);
            return (
              <Text
                key={`${value}-${index}`}
                style={[
                  styles.text,
                  {
                    color: getColor(num),
                    opacity: index === latestMultipliers.length - 1 ? 0.6 : 1,
                  },
                ]}
              >
                {num.toFixed(2)}x
              </Text>
            );
          })}
        </ScrollView>

        {/* Always show the button for testing */}
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setShowModal(true)}
        >
          <Icon name="more-horiz" size={20} color="#fff" />
        </TouchableOpacity>
      </View>


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
                {displayHistory.map((value, index) => {
                  const num = parseFloat(value);
                  return (
                    <Text
                      key={`${value}-${index}`}
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 10.5,
    fontWeight: "200",
    marginRight: 14,
    fontFamily: "",
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    marginTop: 100,
    marginLeft: 5,
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    width: "99%",
    maxHeight: "80%",
    borderRadius: 10,
    padding: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  modalTitle: { fontSize: 14, fontFamily: "Oswald-VariableFont_wght", color: "#b4b4b4ff", },
  tableCell: {
    fontSize: 14,
    paddingHorizontal: 7,
    paddingVertical: 5,
    width: '20%',
    textAlign: 'center',
  },
});

export default MultipliersBar;