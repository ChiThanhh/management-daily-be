import supabase from "../config/supabaseClient.js";

//thêm nhân viên
export const createEmployee = async (req, res) => {
    const { name, position, phone } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    try {
        const { data, error } = await supabase
            .from("employees")
            .insert([{ name, position, phone }])
            .select();
        if (error) {
            return res.status(500).json({ error: "Failed to create employee" });
        }
        return res.status(201).json({ message: 'Employee created successfully', employee: data[0] });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
//lấy danh sách nhân viên
export const getAllEmployees = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("employees")
            .select(`id, name, phone, employee_expenses (
                    date,
                    amount
                )`);
        if (error) {
            return res.status(500).json({ error: "Failed to fetch employees" });
        }
        return res.status(200).json({ message: 'Lấy danh sách nhân viên thành công', employees: data });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
//cập nhật thông tin nhân viên
export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, position, phone } = req.body;

    if (!name && !position && !phone) {
        return res.status(400).json({ error: "At least one field is required" });
    }

    try {
        const { data, error } = await supabase
            .from("employees")
            .update({ name, position, phone })
            .eq("id", id)
            .select();
        if (error) {
            return res.status(500).json({ error: "Failed to update employee" });
        }
        return res.status(200).json({ message: 'Cập nhật thông tin nhân viên thành công', employee: data[0] });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
//xóa nhân viên
export const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from("employees")
            .delete()
            .eq("id", id);
        if (error) {
            return res.status(500).json({ error: "Failed to delete employee" });
        }
        return res.status(200).json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}