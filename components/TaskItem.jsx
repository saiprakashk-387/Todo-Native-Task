import React from "react";
import { View } from "react-native";
import { Checkbox, Text, IconButton, Card } from "react-native-paper";

const getTimeStatus = (date) => {
    const now = new Date();
    const taskTime = new Date(date);
    const diffMs = taskTime - now;
    const diffMins = Math.abs(diffMs) / 60000;
    const hours = Math.floor(diffMins / 60);
    const minutes = Math.floor(diffMins % 60);

    const t = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    return diffMs > 0
        ? hours === 0 ? `${t} mins left` : `${t} hr left`
        : `${t} mins delay`;
};

const formatDate = (date) => {
    const d = new Date(date);
    // Date part
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    // Time part
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // convert 0 → 12
    return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
};

const TaskItem = ({ item, onToggle, onEdit, onDelete }) => {
    return (
        <Card style={{ marginVertical: 6, marginHorizontal: 12 }} mode="elevated">
            <View style={{ flexDirection: "row", padding: 12, alignItems: "flex-start" }}>
                <Checkbox
                    status={item.completed ? "checked" : "unchecked"}
                    onPress={() => onToggle(item.id)}
                />

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontWeight: "bold",
                                flex: 1,
                                textDecorationLine: item.completed ? "line-through" : "none"
                            }}
                        >
                            {item.title}
                        </Text>

                        {!item.completed && (
                            <Text style={{ marginLeft: 10, color: "#555" }}>
                                {getTimeStatus(item.date)}
                            </Text>
                        )}
                    </View>

                    {item.desc ? (
                        <Text style={{ marginTop: 3, color: "#000" }}>{item.desc}</Text>
                    ) : null}
                    <Text style={{ marginTop: 3, color: "#666" }}>{formatDate(item.date)}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <IconButton icon="pencil" onPress={() => onEdit(item)} />
                    <IconButton icon="delete" onPress={() => onDelete(item.id)} />
                </View>
            </View>
        </Card>
    );
};

export default TaskItem;
