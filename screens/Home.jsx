import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAB, TextInput, Chip, Text, Menu } from "react-native-paper";
import IonIcon from 'react-native-vector-icons/Ionicons'

import TaskItem from "../components/TaskItem";
import AddTaskModal from "../components/AddTaskModal";
import Toast from "../components/Toast";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [editTask, setEditTask] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);

    const [visible, setVisible] = useState(false); // menu
    const [statusFilter, setStatusFilter] = useState(""); // pending/completed
    const [sortFilter, setSortFilter] = useState(""); // newest/oldest
    const [activeCategory, setActiveCategory] = useState(""); // category filter

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const data = await AsyncStorage.getItem("TASKS");
        if (data) setTasks(JSON.parse(data));
    };

    const saveTasks = async (newTasks) => {
        setTasks(newTasks);
        await AsyncStorage.setItem("TASKS", JSON.stringify(newTasks));
    };

    const handleSaveTask = (taskData) => {
        if (editTask) {
            const updated = tasks.map((t) =>
                t.id === editTask.id ? { ...t, ...taskData } : t
            );
            saveTasks(updated);
            setEditTask(null);
        } else {
            const newTask = {
                id: Date.now(),
                title: taskData.title,
                desc: taskData.desc,
                category: taskData.category,
                date: taskData.date,
                completed: false,
            };
            saveTasks([...tasks, newTask]);
        }
        setModalVisible(false);
    };

    const toggleTask = (id) => {
        const updated = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks(updated);
    };

    const deleteTask = (id) => {
        saveTasks(tasks.filter((task) => task.id !== id));
    };

    const categories = [...new Set(tasks.map(task => task.category))];

    // ⭐ FILTERED TASKS = SEARCH + CATEGORY + STATUS + SORT
    let filteredTasks = tasks.filter(task => {
        const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory ? task.category === activeCategory : true;
        const matchStatus =
            statusFilter === "pending"
                ? !task.completed
                : statusFilter === "completed"
                    ? task.completed
                    : true;

        return matchSearch && matchCategory && matchStatus;
    });

    // ⭐ SORTING (Newest / Oldest)
    if (sortFilter === "newest") {
        filteredTasks.sort((a, b) => b.id - a.id);
    } else if (sortFilter === "oldest") {
        filteredTasks.sort((a, b) => a.id - b.id);
    }

    const openMenu = () => setVisible((prev) => !prev);
    const closeMenu = () => setVisible(false);

    return (
        <View style={styles.container}>

            {/* SEARCH + FILTER ICON */}
            <View style={{ marginBottom: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>

                    <TextInput
                        label="Search Task"
                        value={search}
                        onChangeText={setSearch}
                        mode="outlined"
                        outlineStyle={{ borderRadius: 20 }}
                        style={{ flex: 1, borderRadius: 20 }}
                    />

                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <IonIcon name="filter" onPress={openMenu} style={styles.filterIcon} size={23} />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setStatusFilter("");
                                setSortFilter("");
                                closeMenu();
                            }}
                            title="All"
                        />
                        <Menu.Item
                            onPress={() => {
                                setStatusFilter("pending");
                                closeMenu();
                            }}
                            title="Pending"
                        />
                        <Menu.Item
                            onPress={() => {
                                setStatusFilter("completed");
                                closeMenu();
                            }}
                            title="Completed"
                        />

                        {/* Divider */}
    

                        <Menu.Item
                            onPress={() => {
                                setSortFilter("newest");
                                closeMenu();
                            }}
                            title="Newest"
                        />
                        <Menu.Item
                            onPress={() => {
                                setSortFilter("oldest");
                                closeMenu();
                            }}
                            title="Oldest"
                        />
                    </Menu>
                </View>
            </View>

            {/* NO TASK MESSAGE */}
            {filteredTasks.length === 0 ? (
                <View style={styles.noContainer}>
                    <Text style={styles.noText}>No Task Found.</Text>
                </View>
            ) : (
                <>
                    {/* CATEGORY CHIPS */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
                        style={{ maxHeight: 60 }}
                    >
                        <Chip
                            style={[
                                styles.chip,
                                activeCategory === "" && { backgroundColor: "#2196F3" }
                            ]}
                            textStyle={{
                                color: activeCategory === "" ? "white" : "black",
                                marginTop: 4
                            }}
                            onPress={() => setActiveCategory("")}
                        >
                            All
                        </Chip>

                        {categories.map((cat, index) => (
                            <Chip
                                key={index}
                                style={[
                                    styles.chip,
                                    activeCategory === cat && { backgroundColor: "#2196F3" }
                                ]}
                                textStyle={{
                                    color: activeCategory === cat ? "white" : "black",
                                    marginTop: 4
                                }}
                                onPress={() =>
                                    setActiveCategory(activeCategory === cat ? "" : cat)
                                }
                            >
                                {cat}
                            </Chip>
                        ))}
                    </ScrollView>

                    {/* TASK LIST */}
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TaskItem
                                item={item}
                                onToggle={toggleTask}
                                onEdit={(task) => {
                                    setEditTask(task);
                                    setModalVisible(true);
                                }}
                                onDelete={deleteTask}
                            />
                        )}
                    />
                </>
            )}

            <FAB
                style={{ position: "absolute", right: 20, bottom: 20 }}
                icon="plus"
                onPress={() => {
                    setEditTask(null);
                    setModalVisible(true);
                }}
            />

            <AddTaskModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveTask}
                taskToEdit={editTask}
                setToastVisible={setToastVisible}
                toastVisible={toastVisible}
            />

            <Toast
                visible={toastVisible}
                message="Please fill all fields before saving"
                onHide={() => setToastVisible(false)}
                icon="info-outline"
                color="red"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    chip: {
        marginRight: 10,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    noContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    noText: {
        fontSize: 18,
        fontWeight: "600",
        color: "blue",
    },
    filterIcon: {
        marginLeft: 5,
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#eee",
        marginTop: 8,
    },
});

export default Home;
