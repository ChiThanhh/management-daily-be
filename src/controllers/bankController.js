import supabase from "../config/supabaseClient.js";

//lấy tất cả danh sách bank
export const getAllBanks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('banks')
            .select(`
                id,
                code,
                name,
                bank_prices (
                    date,
                    price
                )
            `);

        if (error) {
            return res.status(500).json({ error: "Error fetching banks" });
        }

        return res.status(200).json({ message: 'Lấy danh sách ngân hàng thành công', data });
    } catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};


//thêm mới ngân hàng
export const createBank = async (req, res) => {
    const { name, code } = req.body;

    if (!code || !name) {
        return res.status(400).json({ error: "Tên và mã là bắt buộc" });
    }

    try {
        const { data, error } = await supabase
            .from('banks')
            .insert({
                name, code
            })
            .select();
        if (error) {
            return res.status(500).json({ error: "Error creating bank" });
        }
        return res.status(201).json({ message: "Tạo mã thành công", data: data[0] });
    } catch {
        return res.status(500).json({ error: "Internal server error" });
    }

}
//cập nhật ngân hàng
export const updateBank = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    if (!name || !code) {
        return res.status(400).json({ error: "Tên và mã là bắt buộc" });
    }

    try {
        const { data, error } = await supabase
            .from('banks')
            .update({ name, code })
            .eq('id', id)
            .select();
        if (error) {
            return res.status(500).json({ error: "Error updating bank" });
        }
        return res.status(200).json({ message: "Cập nhật ngân hàng thành công", data: data[0] });
    } catch {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//xóa ngân hàng

export const deleteBank = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('banks')
            .delete()
            .eq('id', id)
            .select();
        if (error) {
            return res.status(500).json({ error: "Error deleting bank" });
        }
        return res.status(200).json({ message: "Xóa ngân hàng thành công" });
    } catch {
        return res.status(500).json({ error: "Internal server error" });
    }
}