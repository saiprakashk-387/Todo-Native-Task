import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Modal, TextInput, Button } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import Toast from "../components/Toast";

const AddTaskModal = ({ visible, onClose, onSave, taskToEdit, toastVisible, setToastVisible }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date());

    const [openPicker, setOpenPicker] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDesc(taskToEdit.desc);
            setCategory(taskToEdit.category);
            setDate(taskToEdit.date ? new Date(taskToEdit.date) : new Date());
        } else {
            setTitle("");
            setDesc("");
            setCategory("");
            setDate(new Date());
        }
    }, [taskToEdit]);

    const handleSave = () => {
        if (!title.trim() || !desc.trim() || !category.trim() || !date) {
            setToastVisible(true);
            return;
        } else {
            onSave({
                title,
                desc,
                category,
                date: date.toISOString(),
            });

            setTitle("");
            setDesc("");
            setCategory("");
            setDate(new Date());
        }
    };

    return (
        <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: "white", padding: 20 }}>
            <View style={{ padding: 20, backgroundColor: "white" }}>

                <TextInput
                    label="Task Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    label="Description"
                    value={desc}
                    onChangeText={setDesc}
                    multiline
                    style={{ marginTop: 10 }}
                />

                <TextInput
                    label="Category"
                    value={category}
                    onChangeText={setCategory}
                    style={{ marginTop: 10 }}
                />

                <TouchableOpacity onPress={() => setOpenPicker(true)}>
                    <TextInput
                        label="Estimated Date & Time"
                        value={date.toLocaleString()}
                        editable={false}
                        style={{ marginTop: 10 }}
                    />
                </TouchableOpacity>

                <DatePicker
                    modal
                    open={openPicker}
                    date={date}
                    mode="datetime"
                    onConfirm={(chosenDate) => {
                        setOpenPicker(false);
                        setDate(chosenDate);
                    }}
                    onCancel={() => setOpenPicker(false)}
                />

                <Button
                    mode="contained"
                    style={{ marginTop: 15 }}
                    onPress={handleSave}
                >
                    Save Task
                </Button>

                <Button onPress={onClose} style={{ marginTop: 10 }}>
                    Cancel
                </Button>

            </View>
        </Modal>
    );
};

export default AddTaskModal;
