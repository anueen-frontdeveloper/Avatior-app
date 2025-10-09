import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

type Bet = {
  id: string;
  date: string;
  bet: number;
  multiplier: number;
  cashout: number | null;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const BetHistoryModal: React.FC<Props> = ({ visible, onClose }) => {
  const [bets, setBets] = useState<Bet[]>([
    { id: "1", date: "04 Oct, 2025", bet: 10, multiplier: 2.3, cashout: 23 },
    { id: "2", date: "03 Oct, 2025", bet: 20, multiplier: 1.8, cashout: 36 },
    { id: "3", date: "02 Oct, 2025", bet: 50, multiplier: 0, cashout: 0 },
  ]);

  const loadMore = () => {
    const newData: Bet[] = Array.from({ length: 5 }, (_, i) => ({
      id: (bets.length + i + 1).toString(),
      date: `Sep ${25 - i}, 2025`,
      bet: Math.floor(Math.random() * 50 + 10),
      multiplier: Number((Math.random() * 3).toFixed(2)),
      cashout: Math.floor(Math.random() * 100),
    }));
    setBets((prev) => [...prev, ...newData]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>MY BETS HISTORY</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.column, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.column, { flex: 1 }]}>Bet</Text>
            <Text style={[styles.column, { flex: 1 }]}>Mult.</Text>
            <Text style={[styles.column, { flex: 1 }]}>Cash out</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bet List */}
          <FlatList
            data={bets}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={[styles.cell, { flex: 1.5 }]}>{item.date}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{item.bet}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{item.multiplier}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>
                  {item.cashout === 0 ? "-" : item.cashout}
                </Text>
              </View>
            )}
          />

          {/* Load More Button */}
          <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#2c2c2c",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 1,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginBottom: 5,
  },
  column: {
    color: "#aaa",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  cell: {
    color: "#fff",
    fontSize: 13,
  },
  loadMoreBtn: {
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "#333",
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loadMoreText: {
    color: "#ccc",
    fontWeight: "600",
  },
});

export default BetHistoryModal;
