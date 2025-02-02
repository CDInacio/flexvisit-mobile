import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const Table = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <ScrollView horizontal style={[styles.tableContainer, style]}>
    <View style={styles.table}>{children}</View>
  </ScrollView>
);

const TableHeader = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.tableHeader, style]}>{children}</View>
);

const TableBody = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.tableBody, style]}>{children}</View>
);

const TableFooter = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.tableFooter, style]}>{children}</View>
);

const TableRow = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.tableRow, style]}>{children}</View>
);

const TableCell = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => <View style={[styles.tableCell, style]}>{typeof children === "string" ? <Text>{children}</Text> : children}</View>;

const TableCaption = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <Text style={[styles.tableCaption, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
  },
  tableBody: {
    flexDirection: "column",
  },
  tableFooter: {
    backgroundColor: "#f1f1f1",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableCaption: {
    marginTop: 8,
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
});

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableCell, TableCaption };
