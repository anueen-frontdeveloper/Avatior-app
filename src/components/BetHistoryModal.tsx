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
  title?: string;
  columns?: { key: keyof Bet | string; label: string }[];
  initialBets?: Bet[];
};

const { width, height } = Dimensions.get("window");

const BetHistoryModal: React.FC<Props> = ({
  visible,
  onClose,
  title = "MY BETS HISTORY",
  columns = [
    { key: "date", label: "Date" },
    { key: "bet", label: "Bet" },
    { key: "multiplier", label: "Mult." },
    { key: "cashout", label: "Cash out" },
  ],
  initialBets = [],
}) => {
  const [bets, setBets] = useState<Bet[]>(
    initialBets.length
      ? initialBets
      : [
          { id: "1", date: "04 Oct, 2025", bet: 10, multiplier: 2.3, cashout: 23 },
          { id: "2", date: "03 Oct, 2025", bet: 20, multiplier: 1.8, cashout: 36 },
          { id: "3", date: "02 Oct, 2025", bet: 50, multiplier: 0, cashout: 0 },
        ]
  );

  const loadMore = () => {
    const newData: Bet[] = Array.from({ length: 5 }, (_, i) => ({
      id: (bets.length + i + 1).toString(),
      date: new Date(Date.now() - i * 86400000).toDateString(),
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
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            {columns.map((col) => (
              <Text key={String(col.key)} style={styles.headerCell}>
                {col.label}
              </Text>
            ))}
          </View>
          <View style={styles.divider} />

          {/* List */}
          <FlatList
            data={bets}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
              >
                {columns.map((col) => {
                  const value = item[col.key as keyof Bet];
                  const display =
                    col.key === "cashout" && value === 0 ? "-" : String(value ?? "-");
                  return (
                    <Text key={`${item.id}-${String(col.key)}`} style={styles.cell}>
                      {display}
                    </Text>
                  );
                })}
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Load More */}
          <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
            <Ionicons name="refresh" size={16} color="#fff" />
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modalBox: {
    width: width * 0.9,
    maxHeight: height * 0.75,
    backgroundColor: "#1b1b1b",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 0.6,
    borderColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#232323",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#2c2c2c",
  },
  headerCell: {
    flex: 1,
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  rowEven: {
    backgroundColor: "#212121",
  },
  rowOdd: {
    backgroundColor: "#1a1a1a",
  },
  cell: {
    flex: 1,
    color: "#f0f0f0",
    fontSize: 13,
  },
  loadMoreBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e7000c",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 12,
  },
  loadMoreText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BetHistoryModal;